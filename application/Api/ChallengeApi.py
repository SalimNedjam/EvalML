from django.db.models import Q
from knox.auth import TokenAuthentication
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.models import Challenges
from application.serializers import ChallengeSerializer
from authentification.permissions import IsAdmin


class CreateChallenge(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChallengeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        challenge = serializer.save()
        return Response(
            {
                "challenge": ChallengeSerializer(challenge, context=self.get_serializer_context()).data
            }
        )


class ChallengeFetch(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChallengeSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            criterion1 = Q(course__owner_id=self.request.user)
            criterion2 = Q(course__managment__user_id=self.request.user)
            return Challenges.objects.filter(criterion1 | criterion2)
        else:
            criterion1 = Q(course__enrollment__user_id=self.request.user)
            criterion2 = Q(is_visible=True)
            return Challenges.objects.filter(criterion1 & criterion2)
