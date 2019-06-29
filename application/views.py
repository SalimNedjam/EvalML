from django.core.exceptions import ObjectDoesNotExist
from django.forms import forms
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status

from application.models import Users


@csrf_exempt
def login(request):
    if request.method == 'GET':
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'POST':
        if 'username' in request.POST and 'password' in request.POST:

            try:
                m = Users.objects.get(username=request.POST['username'])

                if m.password == request.POST['password']:
                    request.session['user_id'] = m.userID
                    print(request.session['user_id'])
                    return HttpResponse("You're logged in.")
                else:
                    return HttpResponse("Your username and password didn't match.")

            except ObjectDoesNotExist:
                return HttpResponse("Utilisateur introuvable")
        else:
            return HttpResponse("void data")


@csrf_exempt
def logout(request):
    try:

        del request.session['user_id']
    except KeyError:
        pass
    return HttpResponse("You're logged out.")


@csrf_exempt
def create_user(request):
    if request.method == 'GET':
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'POST':
        if 'username' in request.POST and 'password' in request.POST and 'email' in request.POST and 'matricule' in request.POST:

            try:
                username = exist_username(request.POST['username'])
                email = exist_mail(request.POST['email'])
                matricule = exist_matricule(request.POST['matricule'])
                password = request.POST['password']
                Users.objects.create(username=username, password=password, email=email, matricule=matricule)
                return HttpResponse("Création réussite")

            except forms.ValidationError:
                return HttpResponse("Utilisateur déjà éxistant")
        else:
            return HttpResponse("void data")


def exist_username(username):
    try:
        Users.objects.get(username=username)
    except Users.DoesNotExist:
        return username
    raise forms.ValidationError(u'Username "%s" is already in use.' % username)


def exist_mail(mail):
    try:
        Users.objects.get(email=mail)
    except Users.DoesNotExist:
        return mail
    raise forms.ValidationError(u'Email "%s" is already in use.' % mail)


def exist_matricule(matricule):
    try:
        Users.objects.get(matricule=matricule)
    except Users.DoesNotExist:
        return matricule
    raise forms.ValidationError(u'Matricule "%s" is already in use.' % matricule)
