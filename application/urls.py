from django.conf.urls import url
from django.urls import path, include

from application.Api.ChallengeApi import ChallengeFetch, CreateChallenge, RemoveChallenge
from application.Api.CourseApi import CourseFetch, CreateCourse
from application.Api.EnrollmentApi import EnrollCourse, FetchUsersNonEnrolled, FetchEnrolled, RemoveEnrollment
from application.Api.ManagementApi import AddManagerCourse, FetchNonManager, FetchManager, RemoveManager

urlpatterns = [
    path('api/auth/challenge', ChallengeFetch.as_view()),
    path('api/auth/create_challenge', CreateChallenge.as_view()),
    url(r'api/challenge/remove_challenge/(?P<challenge_id>\d+)/$', RemoveChallenge.as_view()),

    path('api/auth/course', CourseFetch.as_view()),
    path('api/auth/create_course', CreateCourse.as_view()),

    path('api/auth/enroll_course', EnrollCourse.as_view()),
    path('api/auth/fetch_non_enrolled', FetchUsersNonEnrolled.as_view()),
    url(r'api/enrollment/remove_enrollment/(?P<id>\d+)/$', RemoveEnrollment.as_view()),

    path('api/course/fetch_enrolled', FetchEnrolled.as_view()),

    path('api/auth/add_manager', AddManagerCourse.as_view()),
    path('api/auth/fetch_non_manager', FetchNonManager.as_view()),
    path('api/management/fetch_manager', FetchManager.as_view()),
    url(r'api/management/remove_manager/(?P<id>\d+)/$', RemoveManager.as_view()),

    path('', include('application.Urls.Group_Urls')),

]
