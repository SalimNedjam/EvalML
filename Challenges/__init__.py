from .celery import app as celery_app
from application import *
from authentification import *
__all__ = ['celery_app']
