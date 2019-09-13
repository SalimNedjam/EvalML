from rest_framework import serializers
# User Serializer
from rest_framework.fields import SerializerMethodField

from application.models import (Challenges, Course, Enrollment, Groups,
                                Management, Output, Submission, Dataset)
from authentification.models import User
from authentification.serializers import UserSerializer


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenges
        fields = '__all__'


class ChallengePrintSerializer(serializers.ModelSerializer):
    dataset = serializers.ListField()
    scoreKeys = serializers.ListField(default=[])

    class Meta:
        model = Challenges
        fields = ['challenge_id', 'course', 'description', 'inputParam', 'inputExt', 'is_visible', 'limitDate',
                  'nbStudent',
                  'nbSubmit', 'title', 'dataset', 'enable_edit_group', 'enable_delete_submission', 'scoreKeys']


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


class ManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Management
        fields = '__all__'


class OutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Output
        fields = '__all__'


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = '__all__'


class SubmissionSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(default=[])
    score = serializers.ListField(default=[])

    outputs = SerializerMethodField()

    class Meta:
        model = Submission
        fields = '__all__'
        read_only_fields = ['user', 'challenge', 'score', 'status']

    def create(self, validated_data):
        submit = Submission.objects.create(**validated_data)
        return submit

    def get_outputs(self, obj):
        query_output = Output.objects.filter(submission=obj).exclude(ext="log")
        return OutputSerializer(query_output, many=True).data


class SubmissionStaffSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(default=[])
    score = serializers.ListField(default=[])

    outputs = SerializerMethodField()

    class Meta:
        model = Submission
        fields = '__all__'
        read_only_fields = ['user', 'challenge', 'score', 'status']

    def create(self, validated_data):
        submit = Submission.objects.create(**validated_data)
        return submit

    def get_outputs(self, obj):
        query_output = Output.objects.filter(submission=obj)
        return OutputSerializer(query_output, many=True).data


class LeaderBoardSerializer(serializers.ModelSerializer):
    users = serializers.ListField(default=[])
    score = serializers.ListField(default=[])
    tags = serializers.ListField(default=[])

    class Meta:
        model = Submission
        fields = ['score', 'tags', 'users']


class GroupListSerializer(serializers.ModelSerializer):
    email = SerializerMethodField(default="")
    last_name = SerializerMethodField(default="")
    first_name = SerializerMethodField(default="")

    class Meta:
        model = Groups
        fields = ['id', 'group_id', 'user', 'challenge', 'owner', 'email', 'last_name', 'first_name']
        read_only_fields = ('group_id',)

    def get_email(self, obj):
        return obj.user.email

    def get_last_name(self, obj):
        return obj.user.last_name

    def get_first_name(self, obj):
        return obj.user.first_name


class GroupFetchSerializer(serializers.ModelSerializer):
    group_id = serializers.IntegerField()
    id = serializers.IntegerField()

    owner = serializers.BooleanField()

    class Meta:
        model = User
        fields = ['id', 'group_id', 'owner', 'email', 'last_name', 'first_name']


class GroupCreateSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Groups
        fields = '__all__'
        read_only_fields = ('group_id',)

    def get_user(self, obj):
        try:
            query_user = User.objects.get(user_id=obj.user_id)
        except User.DoesNotExist:
            query_user = User.objects.filter(user_id=obj.user_id).first()
        return SimpleUserSerializer(query_user).data


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'email', 'first_name', 'last_name')


class ManagerListSerializer(serializers.ModelSerializer):
    user = SerializerMethodField()

    class Meta:
        model = Management
        fields = '__all__'

    def get_user(self, obj):
        return UserSerializer(User.objects.get(user_id=obj.user.user_id)).data


class ManagerListSerializer(serializers.ModelSerializer):
    user = SerializerMethodField()

    class Meta:
        model = Management
        fields = '__all__'

    def get_user(self, obj):
        return UserSerializer(User.objects.get(user_id=obj.user.user_id)).data


class MiniSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['status']


class StatsSerializer(serializers.ModelSerializer):
    submissions = serializers.ListField(default=[])

    class Meta:
        model = User
        fields = ['email', 'user_id', 'submissions']


class EnrollmentListSerializer(serializers.ModelSerializer):
    user = SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = '__all__'

    def get_user(self, obj):
        return UserSerializer(User.objects.get(user_id=obj.user.user_id)).data

