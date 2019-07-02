from rest_framework import serializers

# User Serializer
from application.models import Challenges, Course, Groups, Enrollment


class ChallengeSerializer(serializers.ModelSerializer):
    categories = serializers.ListField(default=[])
    input_types = serializers.ListField(default=[])

    class Meta:
        model = Challenges
        fields = '__all__'


# CreateUser Serializer
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groups
        fields = '__all__'


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'
