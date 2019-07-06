from django.urls import path

from . import views

urlpatterns = [
    path('login', views.index),
    path('', views.index),

]
