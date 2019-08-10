import os
import uuid

from django.conf import settings
from django.core.files import File
from django.db.models import Q
from django.http import HttpResponse, Http404
from knox.auth import TokenAuthentication
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.models import Challenges, TruthFile, Dataset, Submission
from application.serializers import ChallengeSerializer, ChallengePrintSerializer, DatasetSerializer
from authentification.permissions import IsAdmin, IsStaff


# Fonction de DUPLICATION D'UN CHALLENGE
def duplicate_challenge_func(destination_course_id, challenge_id):
    challenge_source = Challenges.objects.get(challenge_id=challenge_id)
    # Copie du fichier script
    file = File(challenge_source.scriptFile)
    filename = os.path.basename(file.name)
    file.name = filename
    try:
        Challenges.objects.get(course_id=destination_course_id, title=challenge_source.title)
        challenge_name = challenge_source.title + str(uuid.uuid1())[0:8]
    except Challenges.DoesNotExist:
        challenge_name = challenge_source.title

    challenge = Challenges.objects.create(course_id=destination_course_id, title=challenge_name,
                                          description=challenge_source.description,
                                          limitDate=challenge_source.limitDate, nbSubmit=challenge_source.nbSubmit,
                                          nbStudent=challenge_source.nbStudent, inputExt=challenge_source.inputExt,
                                          inputParam=challenge_source.inputParam,
                                          command=challenge_source.command,
                                          scriptFile=File(file),
                                          args=challenge_source.args, outputs=challenge_source.outputs,
                                          scoreKeys=challenge_source.scoreKeys)
    truths = TruthFile.objects.filter(challenge_id=challenge_id)
    dataset = Dataset.objects.filter(challenge_id=challenge_id)
    # Copie des fichiers truths

    for item in truths:
        file = File(item.file)
        filename = os.path.basename(file.name)
        file.name = filename
        TruthFile.objects.create(param=item.param, file=file, course=challenge.course,
                                 challenge=challenge)
    # Copie des fichiers datasets

    for item in dataset:
        file = File(item.file)
        filename = os.path.basename(file.name)
        file.name = filename
        Dataset.objects.create(file=file, course=challenge.course, challenge=challenge)
    return challenge


# DataParam parser
def dataToArray(data, datakey):
    array = []
    i = 0
    while True:
        itemFile = data.get(datakey + "[" + str(i) + "]")

        if None == itemFile:
            break
        array.append(itemFile)
        i += 1
    return array


# TurthParam parser
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


# ArgsParam parser
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


# OutputsParam parser

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
        challenge = serializer.save(args=combinateArgs(self.request.data), outputs=combinateOutputs(self.request.data),
                                    scoreKeys=dataToArray(self.request.data, "scoreKeys"))
        truths = combinateTruth(self.request.data)
        dataset = dataToArray(self.request.data, "dataset")
        # Creation des truths
        for item in truths:
            TruthFile.objects.create(param=item['param'], file=item['file'], course=challenge.course,
                                     challenge=challenge)
        # Creations des datasets
        for item in dataset:
            Dataset.objects.create(file=item, course=challenge.course, challenge=challenge)

        return Response(
            {
                "challenge": ChallengeSerializer(challenge, context=self.get_serializer_context()).data
            }
        )


class DuplicateChallenge(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    authentication_classes = (TokenAuthentication,)

    def post(self, request, *args, **kwargs):
        challenge_id = self.request.data.get("challenge_id")
        destination_course_id = self.request.data.get("course_id")
        challenge = duplicate_challenge_func(destination_course_id, challenge_id)
        return Response(
            {
                "challenge": ChallengeSerializer(challenge, context=self.get_serializer_context()).data
            }
        )


class EditChallenge(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChallengeSerializer

    def get_object(self, queryset=None):
        return Challenges.objects.get(challenge_id=self.request.data.get("challenge_id"))

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=self.request.data)
        serializer.is_valid(raise_exception=True)
        challenge = serializer.save(args=combinateArgs(self.request.data), outputs=combinateOutputs(self.request.data),
                                    scoreKeys=dataToArray(self.request.data, "scoreKeys"))
        # Supression des anciens Truths et datasets
        TruthFile.objects.filter(challenge=challenge).delete()
        Dataset.objects.filter(challenge=challenge).delete()

        truths = combinateTruth(self.request.data)
        dataset = dataToArray(self.request.data, "dataset")
        # Creation des nouveaux Truths et datasets

        for item in truths:
            TruthFile.objects.create(param=item['param'], file=item['file'], course=challenge.course,
                                     challenge=challenge)

        for item in dataset:
            Dataset.objects.create(file=item, course=challenge.course, challenge=challenge)

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
        # Pour staff
        if self.request.user.is_staff:
            criterion1 = Q(course__owner_id=self.request.user)
            criterion2 = Q(course__management__user_id=self.request.user)
            qs = Challenges.objects.filter(criterion1 | criterion2)
        # Pour users
        else:
            criterion1 = Q(course__enrollment__user_id=self.request.user)
            criterion2 = Q(is_visible=True)
            qs = Challenges.objects.filter(criterion1 & criterion2)
            
        for item in qs:
            query_dataset = Dataset.objects.filter(challenge=item)
            item.dataset = DatasetSerializer(query_dataset, many=True).data
        return qs


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
        TruthFile.objects.filter(challenge=instance).delete()
        Dataset.objects.filter(challenge=instance).delete()
        Submission.objects.filter(challenge=instance).delete()

        self.perform_destroy(instance)

        return Response(
            {
                "detail": "ok"
            })


# Rendre un challenge visible ou non par les étudiants
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


# Autoriser ou non la supression des soumissions

class SwitchDeleteSubmission(generics.UpdateAPIView):
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
        instance.enable_delete_submission = not instance.enable_delete_submission
        instance.save()
        self.perform_update(instance)

        return Response({
            "challenge": ChallengeSerializer(instance, context=self.get_serializer_context()).data

        })


# Autoriser ou non la modification des membre d'un groupe


class SwitchEditGroup(generics.UpdateAPIView):
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
        instance.enable_edit_group = not instance.enable_edit_group
        instance.save()
        self.perform_update(instance)

        return Response({
            "challenge": ChallengeSerializer(instance, context=self.get_serializer_context()).data

        })


# Demande de telechargement des datasets
class getDataset(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get(self, request, *args, **kwargs):
        dataset = Dataset.objects.get(file_id=request.GET['file_id'])
        file_path = os.path.join(settings.MEDIA_ROOT, str(dataset.file))
        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/force-download")
                response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
                return response
        raise Http404
