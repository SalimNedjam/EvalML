from __future__ import absolute_import
from django.db.models import Q

from celery import shared_task
from subprocess import Popen, PIPE, STDOUT
from application.models import Submission,Groups,Output



@shared_task
def run_eval(commandLine, submission_id):
    command = [commandLine]
    submission = Submission.objects.get(id=submission_id)
    print(commandLine)
    try:
        process = Popen(command, shell=True, stdout=PIPE, stderr=STDOUT)
        output = process.stdout.read()
        exitstatus = process.poll()
        if exitstatus >= 0:
            submission.status = "SUCCESS"
            submission.score = exitstatus
        else:
            submission.status = "FAIL"
            submission.score = 0
        sb=submission.save()
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
        return {"status": "failed", "output": str(e)}
