from django.urls import path

from .api import ChallengeFetch, CreateChallenge, CreateCourse, CourseFetch, FetchUsersNotInGroup, CreateGroup, \
    FetchUsersNonEnrolled, EnrollCourse, AddManagerCourse, FetchNonManager

urlpatterns = [
    path('api/auth/challenge', ChallengeFetch.as_view()),
    path('api/auth/create_challenge', CreateChallenge.as_view()),

    path('api/auth/course', CourseFetch.as_view()),
    path('api/auth/create_course', CreateCourse.as_view()),

    path('api/auth/create_group', CreateGroup.as_view()),
    path('api/auth/fetch_groups', FetchUsersNotInGroup.as_view()),

    path('api/auth/enroll_course', EnrollCourse.as_view()),
    path('api/auth/fetch_non_enrolled', FetchUsersNonEnrolled.as_view()),

    path('api/auth/add_manager', AddManagerCourse.as_view()),
    path('api/auth/fetch_non_manager', FetchNonManager.as_view()),

]
