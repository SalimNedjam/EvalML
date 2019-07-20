from django.conf.urls import url
from django.urls import path

from application.Api.SubmissionApi import SubmissionCreate, SubmissionFetch

urlpatterns = [

    url(r'api/submission/(?P<challenge_id>\d+)/$', SubmissionCreate.as_view()),
    path('api/submission/fetch_submission', SubmissionFetch.as_view()),

]
