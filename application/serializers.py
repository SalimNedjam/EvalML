from rest_framework import serializers
# User Serializer
from rest_framework.fields import SerializerMethodField

from application.models import (Challenges, Course, Enrollment, Groups,
                                Management, Output, Submission, Dataset)
from authentification.models import Users
from authentification.serializers import UserSerializer


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenges
        fields = '__all__'


class ChallengePrintSerializer(serializers.ModelSerializer):
    dataset = SerializerMethodField()

    class Meta:
        model = Challenges
        fields = ['challenge_id', 'course', 'description', 'inputParam', 'inputExt', 'is_visible', 'limitDate',
                  'nbStudent',
                  'nbSubmit', 'title', 'dataset', 'enable_edit_group', 'enable_delete_submission']

    def get_dataset(self, obj):
        query_dataset = Dataset.objects.filter(challenge=obj)
        return DatasetSerializer(query_dataset, many=True).data


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
        query_output = Output.objects.filter(submission=obj)
        return OutputSerializer(query_output, many=True).data


class LeaderBoardSerializer(serializers.ModelSerializer):
    users = SerializerMethodField()
    score = serializers.ListField(default=[])
    tags = serializers.ListField(default=[])

    class Meta:
        model = Submission
        fields = ['score', 'challenge_id', 'date_submit', 'tags', 'users']

    def get_users(self, obj):
        id_list = list(Submission.objects.filter(input_file=obj.input_file).values_list('user_id', flat=True))

        query_users = Users.objects.filter(user_id__in=id_list)
        return SimpleUserSerializer(query_users, many=True).data


class GroupListSerializer(serializers.ModelSerializer):
    user = SerializerMethodField()

    class Meta:
        model = Groups
        fields = '__all__'
        read_only_fields = ('group_id',)

    def get_user(self, obj):
        try:
            query_user = Users.objects.get(user_id=obj.user_id)
        except Users.DoesNotExist:
            query_user = Users.objects.filter(user_id=obj.user_id).first()
        return SimpleUserSerializer(query_user).data


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'email', 'first_name', 'last_name')


class ManagerListSerializer(serializers.ModelSerializer):
    user = SerializerMethodField()

    class Meta:
        model = Management
        fields = '__all__'

    def get_user(self, obj):
        return UserSerializer(Users.objects.get(user_id=obj.user.user_id)).data


class ManagerListSerializer(serializers.ModelSerializer):
    user = SerializerMethodField()

    class Meta:
        model = Management
        fields = '__all__'

    def get_user(self, obj):
        return UserSerializer(Users.objects.get(user_id=obj.user.user_id)).data


class EnrollmentListSerializer(serializers.ModelSerializer):
    user = SerializerMethodField()

    class Meta:
        model = Management
        fields = '__all__'

    def get_user(self, obj):
        return UserSerializer(Users.objects.get(user_id=obj.user.user_id)).data
