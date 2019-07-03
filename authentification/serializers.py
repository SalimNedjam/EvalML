import string

from allauth.account.forms import ResetPasswordForm
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.utils.crypto import random
from django.utils.translation import ugettext_lazy as _
from rest_auth.serializers import PasswordResetSerializer
from rest_framework import serializers

from application.models import Users


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'matricule', 'username', 'first_name', 'last_name', 'is_staff', 'is_admin')


# CreateUser Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'matricule', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))

        user = Users.objects.create_user(validated_data['username'], password,
                                         validated_data['matricule'])
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value


class ChangeInformationsSerializer(serializers.Serializer):
    last_name = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)


class CustomPasswordResetSerializer(PasswordResetSerializer):
    username = serializers.EmailField()
    password_reset_form_class = ResetPasswordForm

    def validate_email(self, value):
        # Create PasswordResetForm with the serializer
        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(self.reset_form.errors)

        if not get_user_model().objects.filter(username=value).exists():
            raise serializers.ValidationError(_('Invalid e-mail address'))

        return value

    def save(self):
        request = self.context.get('request')
        # Set some values to trigger the send_email method.
        opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),
            'request': request,
        }
        opts.update(self.get_email_options())
        self.reset_form.save(**opts)

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class CustomTokenSerializer(serializers.Serializer):
    token = serializers.CharField()

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass
