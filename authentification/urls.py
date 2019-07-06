from django.urls import path, include
from django_rest_passwordreset.views import reset_password_confirm, reset_password_request_token
from knox import views as knox_views

from authentification.views import CustomPasswordTokenVerificationView
from .api import RegisterAPI, LoginAPI, UserAPI, ChangePasswordView, ChangeInformationsView

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/createUser', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/change_password', ChangePasswordView.as_view()),
    path('api/auth/change_informations', ChangeInformationsView.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view()),
    path('api/auth/reset-password/verify-token', CustomPasswordTokenVerificationView.as_view()),
    path('api/auth/reset-password', reset_password_request_token),
    path('api/auth/reset-password/confirm', reset_password_confirm),

]
