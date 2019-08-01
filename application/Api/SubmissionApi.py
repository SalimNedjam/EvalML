import os

from django.conf import settings
from django.core.files import File
from django.db.models import Q
from django.http import Http404
from django.http import HttpResponse
from knox.auth import TokenAuthentication
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle

from application.models import Challenges, TruthFile, Groups
from application.models import Output
from application.models import Submission
from application.serializers import SubmissionSerializer, LeaderBoardSerializer
from application.tasks import run_eval


class SubmissionCreate(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    parser_classes = (MultiPartParser,)
    lookup_field = 'challenge_id'
    throttle_classes = [UserRateThrottle]

    def perform_create(self, serializer, format=None):
        content = {
            'status': 'request was permitted'
        }

        user_id = self.request.user
        try:
            Groups.objects.get(user_id=self.request.user.user_id, challenge_id=self.kwargs['challenge_id'])
        except Groups.DoesNotExist:
            raise ValidationError(
                {"groupe": "Vous ne faites partis d'aucun groupe"})

        criterion1 = Q(course__enrollment__user_id=self.request.user)
        criterion2 = Q(is_visible=True)
        criterion3 = Q(challenge_id=self.kwargs['challenge_id'])

        try:
            challenge = Challenges.objects.get(criterion1, criterion2, criterion3)
            if self.request.data.get('input_file') is not None:
                input_file = self.request.data.get('input_file')
                submission = serializer.save(user=user_id, input_file=input_file, challenge=challenge)
                f = open("./model", "r")
                myfile = File(f)
                for item in challenge.outputs:
                    Output.objects.create(param=item['param'], ext=item['ext'], course=challenge.course,
                                          submission=submission, file=myfile)
                logfile = Output.objects.create(param='log', ext='log', course=challenge.course,
                                                submission=submission, file=myfile)
                Output.objects.create(param='score', ext='json', course=challenge.course,
                                      submission=submission, file=myfile)

                command = challenge.command
                script = challenge.scriptFile
                inputParam = challenge.inputParam
                queryTruth = TruthFile.objects.filter(challenge=challenge)
                args = challenge.args
                queryOutputs = Output.objects.filter(submission=submission)
                result = command + " "
                result += str(script) + " "
                result += "-" + inputParam + " " + str(submission.input_file) + " "

                for truth in queryTruth:
                    result += "-" + truth.param + " " + str(truth.file) + " "

                for arg in args:
                    result += "-" + arg['param'] + " " + arg['value'] + " "

                for output in queryOutputs:
                    result += "-" + output.param + " " + str(output.file) + " "
                run_eval.delay(result, submission.id, str(logfile.file))

                return Response(
                    {
                        "submission": SubmissionSerializer(submission, context=self.get_serializer_context()).data
                    }
                )
        except Challenges.DoesNotExist:
            raise ValidationError(
                {"submission": "Vous ne suivez pas se challenge ou le challenge n'existe pas"})


class SubmissionFetch(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = SubmissionSerializer

    def get_queryset(self):
        challenge_id = self.request.GET.get('challenge_id')
        criterion2 = Q(challenge_id=challenge_id, user_id=self.request.user.user_id)
        return Submission.objects.filter(criterion2).order_by('-date_submit')


class SubmissionRating(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = LeaderBoardSerializer

    def get_queryset(self):
        challenge_id = self.request.GET.get('challenge_id')
        input_files = Submission.objects.filter(challenge_id=challenge_id, status="SUCCESS").values(
            "input_file").distinct()
        array = []
        for file in input_files:
            query_sub = Submission.objects.filter(input_file=file["input_file"])
            for sub in query_sub:
                array.append(sub.id)
                break
        return Submission.objects.filter(id__in=array)


class RemoveSubmission(generics.DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = SubmissionSerializer
    lookup_field = 'id'

    def get_queryset(self):
        submission_id = self.kwargs['id']
        queryset_submission = Submission.objects.filter(user_id=self.request.user, id=submission_id)
        return queryset_submission

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        challenge = Challenges.objects.get(challenge_id=instance.challenge.challenge_id)
        if not challenge.enable_delete_submission and not instance.status == "FAIL":
            raise ValidationError(
                {"submission": "Vous ne pouvez pas supprimer de soumission déjà validé"})
        queryset_submission = Submission.objects.filter(input_file=instance.input_file)
        self.perform_destroy(instance)

        for link in queryset_submission:
            self.perform_destroy(link)

        return Response(
            {
                "detail": "ok"
            })


class getOutput(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get(self, request, *args, **kwargs):
        output = Output.objects.get(submission__user=request.user, file_id=request.GET['id'])
        file_path = os.path.join(settings.MEDIA_ROOT, str(output.file))
        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/force-download")
                response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
                return response
        raise Http404
