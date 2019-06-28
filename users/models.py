from django.contrib.auth.models import AbstractBaseUser
from django.db import models

from authentification.models import Users


class Course(models.Model):
    class Meta:
        unique_together = (('course_id', 'owner',),)
        db_table = "course"

    REQUIRED_FIELDS = ['owner', 'course_id']
    course_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(Users, on_delete=models.CASCADE)


class Challenges(models.Model):
    class Meta:
        unique_together = (('challenge_id', 'course'),)
        db_table = "challenges"

    REQUIRED_FIELDS = ['challenge_id', 'course']

    challenge_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)


class Groups(models.Model):
    class Meta:
        unique_together = (('group_id', 'user', 'challenge'),)
        db_table = "groups"

    REQUIRED_FIELDS = ['group_id', 'user', 'challenge']

    group_id = models.IntegerField()
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenges, on_delete=models.CASCADE)

    def __str__(self):
        return self.titre


class Enrollment(models.Model):
    class Meta:
        unique_together = (('user', 'course'),)
        db_table = "enrollment"

    REQUIRED_FIELDS = ['user', 'course']

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    user = models.ForeignKey('Users', on_delete=models.CASCADE)

    def __str__(self):
        return self.titre

