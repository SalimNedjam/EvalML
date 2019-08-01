import random

from django.db.models import Q
from knox.auth import TokenAuthentication
from rest_framework import generics
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.models import Groups, Challenges
from application.serializers import GroupSerializer, GroupListSerializer
from authentification.models import Users
from authentification.permissions import IsStaff
from authentification.serializers import UserSerializer


def random_int_generator():
    return random.randint(1, 10000000)


def unique_group_id_generator(instance):
    # GENERATE RANDOM UNIQUE GROUP_ID
    new_group_id = random_int_generator()
    qs_exists = Groups.objects.filter(group_id=new_group_id).exists()
    if qs_exists:
        return unique_group_id_generator(instance)
    return new_group_id


class AddUserToGroup(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = GroupSerializer

    def post(self, request, *args, **kwargs):
        challenge_id = request.data.get('challenge')
        user_adding = request.data.get('user')

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # CHECK IF USER ENROLLED IN COURSE
        challenge = Challenges.objects.get(challenge_id=challenge_id)
        course_id = challenge.course_id

        criterion1 = Q(enrollment__course__course_id=course_id)
        list1 = list(Users.objects.filter(criterion1).values_list('user_id', flat=True))
        if eval(user_adding) not in list1:
            raise ValidationError({"groupe": "Cet étudiant ne suit pas le cours du challenge."})

        # CHECK IF USER IS ALREADY IN A GROUP FOR THE CHALLENGE
        criterion2 = Q(groups__challenge__challenge_id=challenge_id)
        list2 = list(Users.objects.filter(criterion2).values_list('user_id', flat=True))

        if eval(user_adding) in list2:
            raise ValidationError({"groupe": "Cet étudiant est déjà dans un groupe pour ce challenge."})

        # CHECK IF THE USER IS IN A GROUP
        try:
            # RETREIVE THE GROUP
            my_group = Groups.objects.get(
                Q(user_id=self.request.user) &
                Q(challenge_id=challenge_id))

            # CHECK IF THE USER IS THE OWNER OF THE GROUP
            if not my_group.owner:
                raise ValidationError(
                    {"groupe": "Seul le chef du groupe peut rajouter des membres"})

            if not challenge.enable_edit_group:
                raise ValidationError(
                    {"groupe": "Les groupes sont bloqué"})

            # CHECK IF THERE IS A FREE PLACE IN THE GROUP
            challenge = Challenges.objects.get(challenge_id=challenge_id)
            nb_student_in = Groups.objects.filter(
                Q(challenge_id=challenge_id) &
                Q(group_id=my_group.group_id)).count()

            if challenge.nbStudent == 0 or challenge.nbStudent - nb_student_in > 0:
                group = serializer.save(group_id=my_group.group_id, user_id=user_adding)
            else:
                raise ValidationError(
                    {"groupe": "Le nombre maximum d'étudiants d'un un groupe est de " + str(challenge.nbStudent)})

        except Groups.DoesNotExist:
            # THE USER IS NOT IN A GROUP SO WE CREATE ONE AND ADD THE OTHER USER
            group_id = unique_group_id_generator(self)
            Groups.objects.create(user=request.user, group_id=group_id, challenge_id=challenge_id, owner=True)
            challenge = Challenges.objects.get(challenge_id=challenge_id)

            # CHECK IF THERE IS A FREE PLACE IN THE GROUP
            nb_student_in = Groups.objects.filter(
                Q(challenge_id=challenge_id) &
                Q(group_id=group_id)).count()
            if challenge.nbStudent == 0 or challenge.nbStudent - nb_student_in > 0:
                group = serializer.save(group_id=group_id, user_id=user_adding)
            else:
                raise ValidationError(
                    {"groupe": "Le nombre maximum d'étudiants d'un un groupe est de " + challenge.nbStudent})

        return Response(
            {
                "groupe": GroupSerializer(group, context=self.get_serializer_context()).data
            }
        )


class CreateGroup(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = GroupListSerializer

    def post(self, request, *args, **kwargs):
        challenge_id = request.data.get('challenge')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # CHECK IF THE USER IS IN A GROUP
        try:
            # RETREIVE THE GROUP
            challenge = Challenges.objects.get(challenge_id=challenge_id)
            if not challenge.enable_edit_group:
                raise ValidationError(
                    {"groupe": "Les groupes sont bloqué"})

            my_group = Groups.objects.get(
                Q(user_id=self.request.user) &
                Q(challenge_id=challenge_id))
            Groups.objects.filter(group_id=my_group.group_id)

            raise ValidationError(
                {"groupe": "Vous faites déja partis d'un groupe."})

        except Groups.DoesNotExist:
            # THE USER IS NOT IN A GROUP SO WE CREATE ONE AND ADD THE OTHER USER
            group_id = unique_group_id_generator(self)
            group = Groups.objects.create(user=request.user, group_id=group_id, challenge_id=challenge_id, owner=True)
        return Response(
            {
                "groupe": GroupListSerializer(group, context=self.get_serializer_context()).data
            }
        )


class FetchUsersNotInGroup(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = UserSerializer

    def get_queryset(self):
        challenge_id = self.request.GET.get('challenge')
        course_id = Challenges.objects.get(challenge_id=challenge_id).course_id
        # FETCH FOR USER WHO ARE ENROLLED TO THE COURSE AND ARE NOT ALREADY IN A GROUP
        criterion1 = Q(enrollment__course__course_id=course_id)
        criterion2 = Q(groups__challenge__challenge_id=challenge_id)

        list1 = list(Users.objects.filter(criterion1)
                     .exclude(user_id=self.request.user.user_id).
                     values_list('user_id', flat=True))

        list2 = list(Users.objects.filter(criterion2).values_list('user_id', flat=True))

        list3 = list(filter(lambda x: x not in list2, list1))

        return Users.objects.filter(user_id__in=list3)


class RemoveUser(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)
    serializer_class = UserSerializer
    lookup_field = 'id'

    # RETREIVE THE GROUP INSTANCE
    def get_queryset(self):
        queryset = Groups.objects.filter(id=self.kwargs['id'])
        return queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            challenge = Challenges.objects.get(challenge_id=instance.challenge.challenge_id)
            if not challenge.enable_edit_group:
                raise ValidationError(
                    {"groupe": "Les groupes sont bloqué"})

            if instance.user_id == self.request.user.user_id:
                self.perform_destroy(instance)
            else:
                Groups.objects.get(group_id=instance.group_id, user_id=self.request.user.user_id, owner=True)
                self.perform_destroy(instance)
        except Groups.DoesNotExist:
            raise ValidationError(
                {"groupe": "Seul le chef du groupe peut supprimer des membres"})

        # GIVE THE LEAD OF THE GROUP TO ANOTHER USER IF WE HAVE REMOVED TO GROUP OWNER
        try:
            if instance.owner:
                nextOwner = Groups.objects.filter(group_id=instance.group_id).first()
                nextOwner.owner = True
                nextOwner.save()
        finally:
            return Response(
                {
                    "detail": "ok"
                })


# GET USERS OF A GROUP
class RetrieveGroupList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = GroupListSerializer

    # RETREIVE THE GROUP INSTANCE
    def get_queryset(self):
        challenge_id = self.request.GET['challenge']
        try:
            group = Groups.objects.get(
                Q(user_id=self.request.user) &
                Q(challenge_id=challenge_id))
            return Groups.objects.filter(group_id=group.group_id)

        except Groups.DoesNotExist:
            raise ValidationError(
                {"groupe": "Vous ne faites partis d'aucun groupe"})


# FOR STAFF
class ListGroupsChallenge(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = GroupListSerializer

    # RETREIVE THE GROUP INSTANCE
    def get_queryset(self):
        challenge_id = self.request.GET['challenge']

        criterion1 = Q(course__owner_id=self.request.user)
        criterion2 = Q(course__management__user_id=self.request.user)
        list1 = list(
            Challenges.objects.filter(criterion1 | criterion2, challenge_id=challenge_id).values_list('challenge_id',
                                                                                                      flat=True))

        return Groups.objects.filter(challenge_id__in=list1)


class RemoveUserGroup(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = UserSerializer
    lookup_field = 'id'

    # RETREIVE THE GROUP INSTANCE
    def get_queryset(self):
        criterion1 = Q(course__owner_id=self.request.user)
        criterion2 = Q(course__management__user_id=self.request.user, course__management__is_group_admin=True)
        queryset_challenges = Challenges.objects.filter(criterion1 | criterion2)
        return Groups.objects.filter(challenge_id__in=queryset_challenges, id=self.kwargs['id'])

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        # GIVE THE LEAD OF THE GROUP TO ANOTHER USER IF WE HAVE REMOVED TO GROUP OWNER
        try:
            if instance.owner:
                nextOwner = Groups.objects.filter(group_id=instance.group_id).first()
                nextOwner.owner = True
                nextOwner.save()
        finally:
            return Response(
                {
                    "detail": "ok"
                })


class AddUserGroupForStaff(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = GroupSerializer

    def post(self, request, *args, **kwargs):
        challenge_id = request.data.get('challenge')
        user_adding = request.data.get('user')
        group_id = request.data.get('group_id')

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # CHECK IF USER ENROLLED IN COURSE
        criterion1 = Q(course__owner_id=self.request.user,
                       challenge_id=challenge_id)

        criterion2 = Q(course__management__user_id=self.request.user,
                       course__management__is_group_admin=True,
                       challenge_id=challenge_id)
        try:
            challenge = Challenges.objects.get(criterion1 | criterion2)

            course_id = challenge.course_id

            criterion1 = Q(enrollment__course__course_id=course_id)
            list1 = list(Users.objects.filter(criterion1).values_list('user_id', flat=True))
            if eval(user_adding) not in list1:
                raise ValidationError({"groupe": "Cet étudiant ne suit pas le cours du challenge."})

            # CHECK IF USER IS ALREADY IN A GROUP FOR THE CHALLENGE
            criterion2 = Q(groups__challenge__challenge_id=challenge_id)
            list2 = list(Users.objects.filter(criterion2).values_list('user_id', flat=True))

            if eval(user_adding) in list2:
                raise ValidationError({"groupe": "Cet étudiant est déjà dans un groupe pour ce challenge."})

            group = serializer.save(group_id=group_id, user_id=user_adding)

            return Response(
                {
                    "groupe": GroupSerializer(group, context=self.get_serializer_context()).data
                }
            )
        except Challenges.DoesNotExist:
            raise PermissionDenied()
