from django.db.models import Q
from knox.auth import TokenAuthentication
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.models import Course
from application.serializers import CourseSerializer
from authentification.permissions import IsAdmin


class CreateCourse(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    authentication_classes = (TokenAuthentication,)
    serializer_class = CourseSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save(owner=request.user)

        return Response(
            {
                "course": CourseSerializer(course, context=self.get_serializer_context()).data
            }
        )


class CourseFetch(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = CourseSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            criterion1 = Q(owner_id=self.request.user.user_id)
            criterion2 = Q(management__user_id=self.request.user)
            return Course.objects.filter(criterion1 | criterion2)

        else:
            return Course.objects.filter(enrollment__user_id=self.request.user)
