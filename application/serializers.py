from rest_framework import serializers
# User Serializer
from rest_framework.fields import SerializerMethodField

from application.models import Challenges, Course, Groups, Enrollment, Managment
from authentification.models import Users


class ChallengeSerializer(serializers.ModelSerializer):
    input_types = serializers.ListField(default=[])

    class Meta:
        model = Challenges
        fields = '__all__'


# CreateUser Serializer
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('owner',)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groups
        fields = '__all__'
        read_only_fields = ['group_id', 'user']


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'


class ManagmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Managment
        fields = '__all__'


class GroupListSerializer(serializers.ModelSerializer):
    user = SerializerMethodField()

    class Meta:
        model = Groups
        fields = '__all__'

    def get_user(self, obj):
        return SimpleUserSerializer(Users.objects.get(user_id=obj.user.user_id)).data


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'matricule', 'username', 'first_name', 'last_name')
