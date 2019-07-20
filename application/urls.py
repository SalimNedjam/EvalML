from django.conf.urls import url
from django.urls import path, include

from .views import file_maniputer  # added

urlpatterns = [

    path('', include('application.Urls.Challenge_Urls')),
    path('', include('application.Urls.Course_Urls')),
    path('', include('application.Urls.Management_Urls')),
    path('', include('application.Urls.Enrollment_Urls')),
    path('', include('application.Urls.Group_Urls')),
    path('', include('application.Urls.Submission_Urls')),
    url(r'^file_maniputer_api$', file_maniputer)
]
