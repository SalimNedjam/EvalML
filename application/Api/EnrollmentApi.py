from django.db.models import Q
from knox.auth import TokenAuthentication
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.models import Enrollment, Course
from application.serializers import EnrollmentSerializer, EnrollmentListSerializer,EnrollmentEmailSerializer
from authentification.models import User
from authentification.permissions import IsStaff
from authentification.serializers import UserSerializer


class FetchUsersNonEnrolled(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = UserSerializer

    def get_queryset(self):
        course_id = self.request.GET.get('course_id')

        criterion1 = Q(enrollment__course__course_id=course_id)

        list1 = list(User.objects.exclude(is_staff=True).values_list('user_id', flat=True))
        list2 = list(User.objects.filter(criterion1).values_list('user_id', flat=True))

        list3 = list(filter(lambda x: x not in list2, list1))

        return User.objects.filter(user_id__in=list3)


class EnrollCourse(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = EnrollmentSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
            }
        )

class EnrollCourseEmail(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = EnrollmentSerializer

    def post(self, request, *args, **kwargs):

        try:
            user_id = User.objects.get(email=request.data.get("email")).user_id
            try:
                Enrollment.objects.get(user=user_id, course=request.data.get("course"))
                raise ValidationError({"groupe": request.data.get("email") + " est déjà inscrit"})

            except Enrollment.DoesNotExist:
                request.data["user"] = user_id
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=False)
                serializer.save()

            return Response(
                {
                }
            )
        except User.DoesNotExist:
            raise ValidationError({"groupe": request.data.get("email")+" n'éxiste pas."})




class FetchEnrolled(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = EnrollmentListSerializer

    def get_queryset(self):
        course_id = self.request.GET.get('course_id')
        return Enrollment.objects.filter(course_id=course_id)


class FetchEnrolledChallenge(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = EnrollmentListSerializer

    def get_queryset(self):
        challenge = self.request.GET.get('challenge')

        return Enrollment.objects.filter(course__challenges__challenge_id=challenge)


class RemoveEnrollment(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = EnrollmentSerializer
    lookup_field = 'id'

    def get_queryset(self):
        id_enrollment = self.kwargs['id']
        queryset_challenges = Enrollment.objects.filter(id=id_enrollment)
        return queryset_challenges

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        return Response(
            {
                "detail": "ok"
            })


class RemoveEnrollment(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    authentication_classes = (TokenAuthentication,)
    serializer_class = EnrollmentSerializer
    lookup_field = 'id'

    # RETREIVE THE GROUP INSTANCE
    def get_queryset(self):
        criterion1 = Q(owner_id=self.request.user)
        criterion2 = Q(management__user_id=self.request.user, management__is_course_admin=True)
        queryset_course = Course.objects.filter(criterion1 | criterion2)
        queryset_enroll = Enrollment.objects.filter(id=self.kwargs['id'])
        list_course = list(queryset_course.values_list('course_id', flat=True))
        enroll = queryset_enroll.first()
        if enroll and (enroll.course_id not in list_course):
            raise PermissionDenied()

        return queryset_enroll

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {
                "detail": "ok"
            })
