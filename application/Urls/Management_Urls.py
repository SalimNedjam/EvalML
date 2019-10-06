from django.conf.urls import url
from django.urls import path

from application.Api.ManagementApi import AddManagerCourse, FetchNonManager, FetchManager, RemoveManager,FetchAll


urlpatterns = [

    path('api/management/add_manager', AddManagerCourse.as_view()),
    path('api/management/fetch_non_manager', FetchNonManager.as_view()),
    path('api/management/fetch_all', FetchAll.as_view()),

    path('api/management/fetch_manager', FetchManager.as_view()),
    url(r'api/management/remove_manager/(?P<id>\d+)/$', RemoveManager.as_view()),

]
