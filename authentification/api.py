import requests
from django.utils import timezone
from knox.auth import TokenAuthentication
from knox.models import AuthToken
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from authentification.models import Users
from authentification.permissions import IsAdmin
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, ChangePasswordSerializer, \
    ChangeInformationsSerializer, RegisterStaffSerializer


# CreateUser API
class RegisterAPI(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    authentication_classes = (TokenAuthentication,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        requests.post('http://127.0.0.1:8000/api/auth/reset-password', data={'email': user.email})
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data})


class RegisterStaffAPI(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    authentication_classes = (TokenAuthentication,)
    serializer_class = RegisterStaffSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        requests.post('http://127.0.0.1:8000/api/auth/reset-password', data={'email': user.email})
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data})


# Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


# Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChangePasswordSerializer
    model = Users

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.data.get("old_password")
            if not self.object.check_password(old_password):
                return Response({"Password": ["Mauvais mot de passe."]}, status=status.HTTP_400_BAD_REQUEST)

            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response("Success.", status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeInformationsView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChangeInformationsSerializer
    model = Users

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = ChangeInformationsSerializer(data=request.data)

        if serializer.is_valid():
            last_name = serializer.data.get("last_name")
            first_name = serializer.data.get("first_name")

            self.object.last_name = last_name
            self.object.first_name = first_name
            self.object.save()
            return Response({
                "user": UserSerializer(self.object, context=self.get_serializer_context()).data,
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
