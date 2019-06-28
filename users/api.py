from rest_framework import viewsets

from users.models import Challenges
from .serializers import ChallengeSerialize


class ChallengeAPI(viewsets.ModelViewSet):
    queryset = Challenges.objects.filter(course__enrollment__user__exact=2)
    serializer_class = ChallengeSerialize
