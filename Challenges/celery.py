import os

from celery import Celery

from Challenges import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Challenges.settings')

app = Celery('Challenges')
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
