from django.urls import path, include

from application.Api.ChallengeApi import ChallengeFetch, CreateChallenge
from application.Api.CourseApi import CourseFetch, CreateCourse
from application.Api.EnrollmentApi import EnrollCourse, FetchUsersNonEnrolled
from application.Api.ManagmentApi import AddManagerCourse, FetchNonManager

urlpatterns = [
    path('api/auth/challenge', ChallengeFetch.as_view()),
    path('api/auth/create_challenge', CreateChallenge.as_view()),

    path('api/auth/course', CourseFetch.as_view()),
    path('api/auth/create_course', CreateCourse.as_view()),

    path('api/auth/enroll_course', EnrollCourse.as_view()),
    path('api/auth/fetch_non_enrolled', FetchUsersNonEnrolled.as_view()),

    path('api/auth/add_manager', AddManagerCourse.as_view()),
    path('api/auth/fetch_non_manager', FetchNonManager.as_view()),

    path('', include('application.Urls.Group_Urls')),

]
