from django.core.mail import send_mail
from django.db.models import Q
from knox.auth import TokenAuthentication
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.models import Course
from application.serializers import CourseSerializer
from authentification.models import Users
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


class SendEmail(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)

    def post(self, request, *args, **kwargs):
        subject = request.data.get('subject')
        message = request.data.get('message')
        course = Course.objects.get(course_id=request.data.get('course_id'))

        email_from = request.user.email
        query_recipients = Users.objects.filter(enrollment__course__course_id=request.data.get('course_id'))
        recipients = []
        for user in query_recipients:
            recipients.append(user.email)
        recipients.append(request.user.email)
        if course.owner_id != request.user.user_id:
            recipients.append(Users.objects.get(user_id=course.owner_id).email)
        send_mail(subject, message, email_from, recipients)
        return Response(
            {
                "detail": "ok"
            })
