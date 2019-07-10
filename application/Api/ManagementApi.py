from django.db.models import Q
from knox.auth import TokenAuthentication
from mongoengine import DoesNotExist
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.models import Course, Management
from application.serializers import ManagementSerializer, ManagerListSerializer
from authentification.models import Users
from authentification.permissions import IsStaff, IsAdmin
from authentification.serializers import UserSerializer


class FetchNonManager(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = UserSerializer

    def get_queryset(self):
        course_id = self.request.GET.get('course_id')
        owner_id = Course.objects.get(course_id=course_id).owner_id

        criterion1 = Q(management__course__course_id=course_id)

        list1 = list(
            Users.objects.filter(is_staff=True).values_list('user_id', flat=True))

        if self.request.user.user_id in list1:
            list1.remove(self.request.user.user_id)
        if owner_id in list1:
            list1.remove(owner_id)

        list2 = list(Users.objects.filter(criterion1).values_list('user_id', flat=True))

        list3 = list(filter(lambda x: x not in list2, list1))

        return Users.objects.filter(user_id__in=list3)


class AddManagerCourse(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    authentication_classes = (TokenAuthentication,)
    serializer_class = ManagementSerializer

    def post(self, request, *args, **kwargs):
        user_id = self.request.data.get('user')
        course_id = self.request.data.get('course')
        user = Users.objects.get(user_id=user_id)

        if user.is_staff:
            owner_id = Course.objects.get(course_id=course_id).owner_id
            if owner_id == self.request.user.user_id:
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                manager = serializer.save()
                return Response(
                    {
                        "manager": ManagementSerializer(manager, context=self.get_serializer_context()).data
                    }
                )
            else:
                try:
                    manage = Management.objects.get(Q(user_id=self.request.user.user_id) & Q(course_id=course_id))
                    if manage.is_admin:
                        serializer = self.get_serializer(data=request.data)
                        serializer.is_valid(raise_exception=True)
                        manager = serializer.save()
                        return Response(
                            {
                                "manager": ManagementSerializer(manager, context=self.get_serializer_context()).data
                            }
                        )
                    else:
                        raise PermissionDenied()
                except DoesNotExist:
                    raise PermissionDenied()
        else:
            raise PermissionDenied()


class FetchManager(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = ManagerListSerializer

    def get_queryset(self):
        course_id = self.request.GET.get('course_id')
        return Management.objects.filter(course_id=course_id, course__owner_id=self.request.user.user_id)
