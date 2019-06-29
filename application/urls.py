from django.urls import path

from .api import ChallengeFetch, CreateChallenge, CreateCourse, CourseFetch, FetchUsersNotInGroup, CreateGroup

urlpatterns = [
    path('api/auth/challenge', ChallengeFetch.as_view()),
    path('api/auth/create_challenge', CreateChallenge.as_view()),

    path('api/auth/course', CourseFetch.as_view()),
    path('api/auth/create_course', CreateCourse.as_view()),

    path('api/auth/create_group', CreateGroup.as_view()),

    path('api/auth/fetchgroups', FetchUsersNotInGroup.as_view()),

]
