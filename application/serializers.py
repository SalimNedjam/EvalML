from rest_framework import serializers

# User Serializer
from application.models import Challenges, Course, Groups, Enrollment, Managment


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


class ManagmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Managment
        fields = '__all__'
