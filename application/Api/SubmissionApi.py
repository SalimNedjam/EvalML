from django.db.models import Q
from knox.auth import TokenAuthentication
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle

from application.models import Submission, Challenges
from application.serializers import SubmissionSerializer


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
        criterion1 = Q(course__enrollment__user_id=self.request.user)
        criterion2 = Q(is_visible=True)
        criterion3 = Q(challenge_id=self.kwargs['challenge_id'])
        try:
            challenge = Challenges.objects.get(criterion1, criterion2, criterion3)
            if self.request.data.get('input_file') is not None:
                input_file = self.request.data.get('input_file')
                submission = serializer.save(user=user_id, input_file=input_file, challenge=challenge)
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
        criterion2 = Q(challenge_id=challenge_id)
        return Submission.objects.filter(criterion2)
