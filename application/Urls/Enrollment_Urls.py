from django.conf.urls import url
from django.urls import path

from application.Api.EnrollmentApi import EnrollCourse, FetchUsersNonEnrolled, FetchEnrolled, RemoveEnrollment,EnrollCourseEmail

urlpatterns = [

    path('api/enrollment/fetch_enrolled', FetchEnrolled.as_view()),
    path('api/enrollment/enroll_course', EnrollCourse.as_view()),
    path('api/enrollment/enroll_course_email', EnrollCourseEmail.as_view()),

    path('api/enrollment/fetch_non_enrolled', FetchUsersNonEnrolled.as_view()),
    url(r'api/enrollment/remove_enrollment/(?P<id>\d+)/$', RemoveEnrollment.as_view()),

]
