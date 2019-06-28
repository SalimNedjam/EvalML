from rest_framework import serializers

# User Serializer
from users.models import Challenges, Course


class CourseSerialize(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class ChallengeSerialize(serializers.ModelSerializer):

    class Meta:
        model = Challenges
        fields = ('challenge_id',)

