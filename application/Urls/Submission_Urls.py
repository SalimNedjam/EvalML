from django.conf.urls import url
from django.urls import path

from application.Api.SubmissionApi import SubmissionCreate, SubmissionFetch, RemoveSubmission, getOutput, \
    SubmissionRating

urlpatterns = [

    url(r'api/submission/(?P<challenge_id>\d+)/$', SubmissionCreate.as_view()),
    path('api/submission/fetch_submission', SubmissionFetch.as_view()),
    path('api/submission/fetch_rating', SubmissionRating.as_view()),

    url(r'api/submission/remove_submission/(?P<id>\d+)/$', RemoveSubmission.as_view()),
    path('api/submission/get_file/', getOutput.as_view()),

]
