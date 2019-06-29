import string

from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.utils.crypto import random
from rest_framework import serializers

# User Serializer
from application.models import Users


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'matricule', 'username', 'first_name', 'last_name', 'is_staff')


# CreateUser Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'matricule', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
        send_mail('Your account has been created.', 'Here is the password:' + password,
                  'dzdeepapps@gmail.com', [validated_data['username']],
                  fail_silently=False)
        user = Users.objects.create_user(validated_data['username'], password,
                                         validated_data['matricule'])

        return user


# Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
