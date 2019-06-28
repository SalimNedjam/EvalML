from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from djongo.models import ListField, ArrayModelField

from authentification.models import Users


class Course(models.Model):
    class Meta:
        db_table = "course"

    REQUIRED_FIELDS = ['course_id']

    course_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(Users, on_delete=models.CASCADE, null=True)
    description = models.TextField()



class Challenges(models.Model):
    class Meta:
        unique_together = (('challenge_id', 'course'),)
        db_table = "challenges"

    REQUIRED_FIELDS = ['challenge_id', 'course']

    challenge_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    is_visible = models.BooleanField(default=False)
    title = models.TextField()
    description = models.TextField()
    categories = ListField(default=[])
    input_types = ListField(default=[])





class Groups(models.Model):
    class Meta:
        db_table = "groups"
        constraints = [
            models.UniqueConstraint(fields=['user', 'challenge'], name='UNIQUE_GROUP_ENTRY')
        ]

    REQUIRED_FIELDS = ['group_id', 'user', 'challenge']

    group_id = models.IntegerField()
    user = models.ForeignKey(Users, on_delete=models.CASCADE, null=True)
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

