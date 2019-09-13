"""
    WSGI config for challenges project.
    
    It exposes the WSGI callable as a module-level variable named ``application``.
    
    For more information on this file, see
    https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/
    """

import os
import sys

PROJECT_DIR = os.path.dirname(os.path.realpath(__file__))
ROOT_DIR = os.path.dirname(PROJECT_DIR)
APPS_DIR = os.path.realpath(os.path.join(ROOT_DIR, 'apps'))
sys.path.append(APPS_DIR)
path = os.path.dirname(os.path.abspath(__file__))
sys.path.append(path)

sys.path.append('/home/evalml/project/Challenges/')
sys.path.append('/home/evalml/project/Challenges/Challenges/')
sys.path.append('/home/evalml/project/Challenges/application/')
sys.path.append('/home/evalml/project/Challenges/authentification/')
sys.path.append('/home/evalml/project/Challenges/frontend/')
sys.path.append('/home/evalml/project/Challenges/Challenges/wsgi.py')


activate_this = os.path.join(path, "/home/evalml/project/venv/bin/activate_this.py")
exec(compile(open(activate_this, "rb").read(), activate_this, 'exec'),dict(__file__=activate_this))
from django.core.wsgi import get_wsgi_application
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Challenges.settings")
application = get_wsgi_application()

