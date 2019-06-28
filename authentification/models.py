from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models



class MyUserManager(BaseUserManager):
    use_in_migrations = True

    # python manage.py createsuperuser
    def create_superuser(self, username, password):
        user = self.model(
            username=username,
            is_staff=True,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password, matricule):
        user = self.model(
            username=username,
            matricule=matricule,
            is_staff=False,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


class Users(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    username = models.EmailField(max_length=127, unique=True, null=False, blank=False)
    password = models.CharField(max_length=255)
    matricule = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=127)
    last_name = models.CharField(max_length=127)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = MyUserManager()

    USERNAME_FIELD = "username"

    # REQUIRED_FIELDS must contain all required fields on your User model,
    # but should not contain the USERNAME_FIELD or password as these fields will always be prompted for.

    class Meta:
        app_label = "users"
        db_table = "users"

    def __str__(self):
        return self.username

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    # this methods are require to login super user from admin panel
    def has_perm(self, perm, obj=None):
        return self.is_staff

    # this methods are require to login super user from admin panel
    def has_module_perms(self, app_label):
        return self.is_staff

