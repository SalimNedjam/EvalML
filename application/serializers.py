from rest_framework import serializers
# User Serializer
from rest_framework.fields import SerializerMethodField

from application.models import Submission, Challenges, Course, Groups, Enrollment, Management, Output
from authentification.models import Users
from authentification.serializers import UserSerializer


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenges
        fields = '__all__'


class ChallengePrintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenges
        fields = ['challenge_id', 'course', 'description', 'inputExt', 'is_visible', 'limitDate', 'nbStudent',
                  'nbSubmit', 'title']


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


class SubmissionSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(default=[])
    outputs = SerializerMethodField()

    class Meta:
        model = Submission
        fields = '__all__'
        read_only_fields = ['user', 'challenge', 'score', 'status']

    def create(self, validated_data):
        submit = Submission.objects.create(**validated_data)
        return submit

    def get_outputs(self, obj):
        query_output = Output.objects.filter(submission_id=obj.id)
        return OutputSerializer(query_output, many=True).data


class LeaderBoardSerializer(serializers.ModelSerializer):
    users = SerializerMethodField()

    class Meta:
        model = Submission
        fields = ['score', 'challenge_id', 'date_submit', 'tags', 'users']

    def get_users(self, obj):
        id_list = list(Submission.objects.filter(input_file=obj.input_file).values_list('user_id', flat=True))

        query_users = Users.objects.filter(user_id__in=id_list)
        return UserSerializer(query_users, many=True).data


class GroupListSerializer(serializers.ModelSerializer):
    user = SerializerMethodField()

    class Meta:
        model = Groups
        fields = '__all__'
        read_only_fields = ('group_id',)

    def get_user(self, obj):
        return SimpleUserSerializer(Users.objects.get(user_id=obj.user.user_id)).data


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'matricule', 'username', 'first_name', 'last_name')


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
