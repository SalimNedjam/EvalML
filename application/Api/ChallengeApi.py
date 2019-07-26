from django.db.models import Q
from knox.auth import TokenAuthentication
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.models import Challenges, TruthFile
from application.serializers import ChallengeSerializer, ChallengePrintSerializer
from authentification.permissions import IsAdmin, IsStaff


def combinateTruth(data):
    array = []
    i = 0
    while True:
        itemParam = data.get("truthFilesParam" + "[" + str(i) + "]")
        itemFile = data.get("truthFiles" + "[" + str(i) + "]")

        if None == itemFile or None == itemParam:
            break
        item = {}
        item["param"] = itemParam
        item["file"] = itemFile
        array.append(item)
        i += 1
    return array


def combinateArgs(data):
    array = []
    i = 0
    while True:
        itemValue = data.get("argsValue" + "[" + str(i) + "]")
        itemParam = data.get("argsParam" + "[" + str(i) + "]")

        if None == itemValue or None == itemParam:
            break
        item = {}
        item["param"] = itemParam
        item["value"] = itemValue
        array.append(item)
        i += 1
    return array


def combinateOutputs(data):
    array = []
    i = 0
    while True:
        itemParam = data.get("outputsParam" + "[" + str(i) + "]")
        itemExt = data.get("outputsExt" + "[" + str(i) + "]")

        if None == itemExt or None == itemParam:
            break
        item = {}
        item["param"] = itemParam
        item["ext"] = itemExt
        array.append(item)
        i += 1
    return array


class CreateChallenge(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChallengeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        challenge = serializer.save(args=combinateArgs(self.request.data), outputs=combinateOutputs(self.request.data))
        truths = combinateTruth(self.request.data)
        for item in truths:
            TruthFile.objects.create(param=item['param'], file=item['file'], course=challenge.course,
                                     challenge=challenge)

        return Response(
            {
                "challenge": ChallengeSerializer(challenge, context=self.get_serializer_context()).data
            }
        )


class ChallengeFetch(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChallengePrintSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            criterion1 = Q(course__owner_id=self.request.user)
            criterion2 = Q(course__management__user_id=self.request.user)
            return Challenges.objects.filter(criterion1 | criterion2)
        else:
            criterion1 = Q(course__enrollment__user_id=self.request.user)
            criterion2 = Q(is_visible=True)
            return Challenges.objects.filter(criterion1 & criterion2)


class RemoveChallenge(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChallengeSerializer
    lookup_field = 'challenge_id'

    def get_queryset(self):
        challenge_id = self.kwargs['challenge_id']
        queryset_challenges = Challenges.objects.filter(course__owner_id=self.request.user, challenge_id=challenge_id)
        return queryset_challenges

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        return Response(
            {
                "detail": "ok"
            })


class SwitchVisibility(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChallengeSerializer
    lookup_field = 'challenge_id'

    def get_queryset(self):
        challenge_id = self.kwargs['challenge_id']
        queryset_challenges = Challenges.objects.filter(course__owner_id=self.request.user, challenge_id=challenge_id)
        return queryset_challenges

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_visible = not instance.is_visible
        instance.save()
        self.perform_update(instance)

        return Response({
            "challenge": ChallengeSerializer(instance, context=self.get_serializer_context()).data

        })
