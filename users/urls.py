from django.urls import path

from .api import ChallengeAPI

urlpatterns = [
    path('api/auth/challenge', ChallengeAPI.as_view({'get': 'list'})),

]
