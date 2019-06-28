from django.contrib.auth import authenticate
from rest_framework import serializers

# User Serializer
from users.models import Users


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'matricule', 'username', 'first_name', 'last_name', 'is_staff')


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'matricule', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Users.objects.create_user(validated_data['username'], validated_data['password'],
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
