import random

from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from django.utils import timezone
from djongo.models import ListField

from authentification.models import Users


class Course(models.Model):
    class Meta:
        db_table = "course"

    REQUIRED_FIELDS = ['course_id']

    course_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(Users, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    description = models.TextField()
    freqSubmit = models.IntegerField(default=0)
    nbSubmit = models.IntegerField(default=-1)
    nbStudent = models.IntegerField(default=-1)


def script_path(instance, filename):
    return 'Course_{0}/challenge_{1}/{2}'.format(instance.course.course_id, instance.title, filename)


class Challenges(models.Model):
    class Meta:
        unique_together = (('challenge_id', 'course'),)
        db_table = "challenges"

    REQUIRED_FIELDS = ['challenge_id', 'course']

    challenge_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    is_visible = models.BooleanField(default=False)
    title = models.TextField()
    limitDate = models.DateTimeField(blank=True, null=True)
    description = models.TextField()
    nbSubmit = models.IntegerField(default=0)
    nbStudent = models.IntegerField(default=0)
    inputExt = models.TextField()
    inputParam = models.TextField()
    command = models.TextField()
    scriptFile = models.FileField(upload_to=script_path)
    args = ListField(default=[])
    outputs = ListField(default=[])


def truth_path(instance, filename):
    return 'Course_{0}/challenge_{1}/{2}'.format(instance.course.course_id, instance.challenge.title, filename)


class TruthFile(models.Model):
    class Meta:
        db_table = "truthFile"

    file_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    challenge = models.ForeignKey(Challenges, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    file = models.FileField(upload_to=truth_path, default="")
    param = models.TextField()


class Groups(models.Model):
    class Meta:
        db_table = "groups"
        constraints = [
            models.UniqueConstraint(fields=['user', 'challenge'], name='UNIQUE_GROUP_ENTRY')
        ]

    REQUIRED_FIELDS = ['user', 'challenge']

    group_id = models.IntegerField()
    user = models.ForeignKey(Users, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    challenge = models.ForeignKey(Challenges, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    owner = models.BooleanField(default=False)

    def __str__(self):
        return str(self.group_id)


class Enrollment(models.Model):
    class Meta:
        db_table = "enrollment"
        constraints = [
            models.UniqueConstraint(fields=['user', 'course'], name='UNIQUE_ENROLLMENT_ENTRY')
        ]

    REQUIRED_FIELDS = ['user', 'course']

    course = models.ForeignKey(Course, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    user = models.ForeignKey(Users, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})

    def __str__(self):
        return self.titre


class Management(models.Model):
    class Meta:
        db_table = "management"
        constraints = [
            models.UniqueConstraint(fields=['user', 'course'], name='UNIQUE_MANAGEMENT_ENTRY')
        ]

    REQUIRED_FIELDS = ['user', 'course']

    course = models.ForeignKey(Course, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    user = models.ForeignKey(Users, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    is_course_admin = models.BooleanField(default=False)
    is_group_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.titre


def directory_path(instance, filename):
    return 'Submissions/challenge_{0}/user_{1}/input_{2}_{3}.{4}'.format(instance.challenge.challenge_id,
                                                                         instance.user.user_id,
                                                                         timezone.now().timestamp(),
                                                                         random.randint(1, 101),
                                                                         instance.challenge.inputExt)


class Submission(models.Model):
    class Meta:
        db_table = "submission"

    PENDING = 'PENDING'
    SUCCESS = 'SUCCESS'
    FAIL = 'FAIL'
    STATUS_CHOICES = (
        (PENDING, 'PENDING'),
        (SUCCESS, 'SUCCESS'),
        (FAIL, 'FAIL'),
    )

    challenge = models.ForeignKey(Challenges, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    user = models.ForeignKey(Users, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})

    date_submit = models.DateTimeField(default=timezone.now)
    score = models.IntegerField(default=0)
    input_file = models.FileField(upload_to=directory_path)
    status = models.CharField(choices=STATUS_CHOICES, default=PENDING, max_length=10)
    tags = ListField(default=[])


def outputs_path(instance, filename):
    return 'Submissions/challenge_{0}/user_{1}/output_{2}{3}.{4}'.format(instance.submission.challenge.challenge_id,
                                                                         instance.submission.user.user_id,
                                                                         timezone.now().timestamp(),
                                                                         random.randint(1, 101),
                                                                         instance.ext)


class Output(models.Model):
    class Meta:
        db_table = "output"

    file_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, error_messages={'invalide': 'n\'éxiste pas'})
    file = models.FileField(upload_to=outputs_path)
    ext = models.TextField()
    param = models.TextField()
