from django.conf.urls import url
from django.urls import path

from application.Api.ChallengeApi import ChallengeFetch, CreateChallenge, SwitchVisibility, RemoveChallenge, getDataset, \
    EditChallenge, SwitchDeleteSubmission, SwitchEditGroup

urlpatterns = [

    path('api/challenge/challenge', ChallengeFetch.as_view()),
    path('api/challenge/create_challenge', CreateChallenge.as_view()),
    path('api/challenge/edit_challenge', EditChallenge.as_view()),

    url(r'api/challenge/remove_challenge/(?P<challenge_id>\d+)/$', RemoveChallenge.as_view()),
    url(r'api/challenge/switch_edit_group/(?P<challenge_id>\d+)/$', SwitchEditGroup.as_view()),
    url(r'api/challenge/switch_delete_submission/(?P<challenge_id>\d+)/$', SwitchDeleteSubmission.as_view()),
    url(r'api/challenge/switch_visibility/(?P<challenge_id>\d+)/$', SwitchVisibility.as_view()),
    path('api/challenge/get_file/', getDataset.as_view()),

]
