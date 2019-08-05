from django.conf.urls import url
from django.urls import path

from . import views

urlpatterns = [
    path('login', views.index),
    path('', views.index),
    url(r'^$', views.index),
    # match all other pages
    url(r'^(?:.*)/?$', views.index),

]
