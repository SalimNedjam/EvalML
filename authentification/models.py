from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone


class MyUserManager(BaseUserManager):
    use_in_migrations = True

    def create_superuser(self, email, password):
        user = self.create_user(
            password=password,
            email=email,

        )
        user.staff = True
        user.admin = True
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.user_type = Users.ADMIN
        user.save(using=self._db)
        return user

    def create_staffuser(self, email, password):
        user = self.create_user(
            password=password,
            email=email,

        )
        user.staff = True
        user.is_staff = True
        user.user_type = Users.STAFF
        user.save(using=self._db)
        return user

    def create_user(self, email, password):
        user = self.model(
            email=email,

        )
        user.set_password(password)
        user.user_type = Users.USER
        user.save(using=self._db)
        return user


class Users(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=127, unique=True, null=True,
                                 blank=False, error_messages={'unique': 'n\'est pas disponible'})
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=127)
    last_name = models.CharField(max_length=127)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = MyUserManager()

    USERNAME_FIELD = "email"

    # REQUIRED_FIELDS must contain all required fields on your User model,
    # but should not contain the USERNAME_FIELD or password as these fields will always be prompted for.

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.email

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email

    ADMIN, STAFF, MOD, USER, GUEST = range(0, 5)
    UserTypes = (
        (ADMIN, 'Admin'),
        (STAFF, 'Staff'),
        (MOD, 'Moderator'),
        (USER, 'User'),
        (GUEST, 'Guest'),
    )
    user_type = models.IntegerField(choices=UserTypes, default=3)
