from rest_framework import serializers

# User Serializer
from application.models import Challenges, Course, Groups


class ChallengeSerialize(serializers.ModelSerializer):
    categories = serializers.ListField(default=[])
    input_types = serializers.ListField(default=[])

    class Meta:
        model = Challenges
        fields = '__all__'


# CreateUser Serializer
class CourseSerialize(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class GroupSerialize(serializers.ModelSerializer):
    class Meta:
        model = Groups
        fields = '__all__'
