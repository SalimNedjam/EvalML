from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from djongo.models import ListField

from authentification.models import Users


class Course(models.Model):
    class Meta:
        db_table = "course"

    REQUIRED_FIELDS = ['course_id']

    course_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(Users, on_delete=models.CASCADE, null=True, error_messages={'invalide': 'n\'éxiste pas'})
    description = models.TextField()
    freqSubmit = models.IntegerField(default=0)
    nbSubmit = models.IntegerField(default=-1)
    nbStudent = models.IntegerField(default=-1)


class Challenges(models.Model):
    class Meta:
        unique_together = (('challenge_id', 'course'),)
        db_table = "challenges"

    REQUIRED_FIELDS = ['challenge_id', 'course']

    challenge_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    is_visible = models.BooleanField(default=False)
    title = models.TextField()
    description = models.TextField()
    freqSubmit = models.IntegerField(default=0)
    nbSubmit = models.IntegerField(default=-1)
    nbStudent = models.IntegerField(default=-1)
    input_types = ListField(default=[])


class Groups(models.Model):
    class Meta:
        db_table = "groups"
        constraints = [
            models.UniqueConstraint(fields=['user', 'challenge'], name='UNIQUE_GROUP_ENTRY')
        ]

    REQUIRED_FIELDS = ['group_id', 'user', 'challenge']

    group_id = models.IntegerField()
    user = models.ForeignKey(Users, on_delete=models.CASCADE, null=True, error_messages={'invalide': 'n\'éxiste pas'})
    challenge = models.ForeignKey(Challenges, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})

    def __str__(self):
        return self.titre


class Enrollment(models.Model):
    class Meta:
        db_table = "enrollment"
        constraints = [
            models.UniqueConstraint(fields=['user', 'course'], name='UNIQUE_GROUP_ENTRY')
        ]

    REQUIRED_FIELDS = ['user', 'course']

    course = models.ForeignKey(Course, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    user = models.ForeignKey(Users, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})

    def __str__(self):
        return self.titre


class Managment(models.Model):
    class Meta:
        db_table = "managment"
        constraints = [
            models.UniqueConstraint(fields=['user', 'course'], name='UNIQUE_GROUP_ENTRY')
        ]

    REQUIRED_FIELDS = ['user', 'course']

    course = models.ForeignKey(Course, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    user = models.ForeignKey(Users, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.titre
