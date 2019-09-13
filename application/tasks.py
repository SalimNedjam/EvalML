from __future__ import absolute_import
from django.db.models import Q

from celery import shared_task
from subprocess import Popen, PIPE, STDOUT
from application.models import Submission,Groups,Output
import json
import sys

@shared_task
def run_eval(commandLine, submission_id,logfile):
    command = [commandLine]
    submission = Submission.objects.get(id=submission_id)
    log = open("/home/evalml/"+logfile, 'w+')
    try:
        print(command)
        process = Popen(command, shell=True, stdout=PIPE, stderr=log)
        output = process.stdout.read()
        exitstatus = process.poll()
        score_file=Output.objects.get(submission=submission,param='score').file
        score = json.load(open("/home/evalml/"+str(score_file)))


        submission.status = "SUCCESS"
        submission.score = [score]
        
    except Exception as e:
        log.write("Failed: {0}".format(str(e)))
        print("Unexpected error:", sys.exc_info()[0])
        submission.status = "FAIL"

    finally:
        submission.save()
        try:
            my_group = Groups.objects.get(
                    Q(user_id=submission.user_id) &
                    Q(challenge_id=submission.challenge_id))
            query_group = Groups.objects.filter(group_id=my_group.group_id).exclude(user_id=submission.user_id)
            query_output=Output.objects.filter(submission=submission)

            for student in query_group:
                submission.user_id=student.user_id
                submission.id=None
                submission.save()
                for output in query_output:
                    output.file_id=None
                    output.submission_id=submission.id
                    output.save()
        except Exception as e:
            log.write("Failed: {0}".format(str(e)))
            print("Unexpected error:", sys.exc_info()[0])

