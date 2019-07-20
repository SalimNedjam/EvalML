from django.conf.urls import url
from django.urls import path

from application.Api.ChallengeApi import ChallengeFetch, CreateChallenge, SwitchVisibility, RemoveChallenge

urlpatterns = [

    path('api/challenge/challenge', ChallengeFetch.as_view()),
    path('api/challenge/create_challenge', CreateChallenge.as_view()),
    url(r'api/challenge/remove_challenge/(?P<challenge_id>\d+)/$', RemoveChallenge.as_view()),
    url(r'api/challenge/switch_visibility/(?P<challenge_id>\d+)/$', SwitchVisibility.as_view()),

]
