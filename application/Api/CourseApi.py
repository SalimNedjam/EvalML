import uuid

from django.core.mail import send_mail
from django.db.models import Q
from knox.auth import TokenAuthentication
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.Api.ChallengeApi import duplicate_challenge_func
from application.models import Course, Challenges
from application.serializers import CourseSerializer
from authentification.models import User
from authentification.permissions import IsAdmin, IsStaff


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


class DuplicateCourse(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    authentication_classes = (TokenAuthentication,)

    def post(self, request, *args, **kwargs):
        course_id = self.request.data.get("course_id")
        course = Course.objects.get(course_id=course_id)
        course.description = course.description + str(uuid.uuid1())[0:8]
        course.course_id = None
        course.save()

        query_challenges = Challenges.objects.filter(course_id=course_id)
        for challenge in query_challenges:
            duplicate_challenge_func(course.course_id, challenge.challenge_id)

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


# Envoi d'emails à tout les étudiants d'un cours et au owner du cours
class SendEmail(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)

    def post(self, request, *args, **kwargs):
        subject = request.data.get('subject')
        message = request.data.get('message')
        course = Course.objects.get(course_id=request.data.get('course_id'))

        email_from = request.user.email
        query_recipients = User.objects.filter(enrollment__course__course_id=request.data.get('course_id'))
        recipients = []
        for user in query_recipients:
            recipients.append(user.email)
        recipients.append(request.user.email)
        if course.owner_id != request.user.user_id:
            recipients.append(User.objects.get(user_id=course.owner_id).email)
        send_mail(subject, message, email_from, recipients)
        return Response(
            {
                "detail": "ok"
            })


class EditCourse(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    authentication_classes = (TokenAuthentication,)
    serializer_class = CourseSerializer

    def get_object(self, queryset=None):
        return Course.objects.get(course_id=self.request.data.get("course_id"), owner=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=self.request.data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        return Response(
            {
                "course": CourseSerializer(course, context=self.get_serializer_context()).data
            }
        )


class RemoveCourse(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = CourseSerializer
    lookup_field = 'course_id'

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        queryset_course = Course.objects.filter(course_id=course_id)
        return queryset_course

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.owner == self.request.user:
            raise PermissionDenied()
        self.perform_destroy(instance)

        return Response(
            {
                "detail": "ok"
            })
