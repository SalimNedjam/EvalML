from datetime import timedelta

from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.utils import timezone
from django_rest_passwordreset.models import ResetPasswordToken
from django_rest_passwordreset.signals import reset_password_token_created
from django_rest_passwordreset.views import get_password_reset_token_expiry_time
from rest_framework import parsers, renderers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CustomTokenSerializer

site_url = 'http://127.0.0.1:8000/#';
site_full_name = 'Challenge';
site_shortcut_name = 'Challenge';


class CustomPasswordResetView:
    @receiver(reset_password_token_created)
    def password_reset_token_created(sender, reset_password_token, *args, **kwargs):
        """
            Handles password reset tokens
            When a token is created, an e-mail needs to be sent to the user
        """
        # send an e-mail to the user
        context = {
            'current_user': reset_password_token.user,
            'username': reset_password_token.user.username,
            'email': reset_password_token.user.username,
            'reset_password_url': "{}/password-reset/{}".format(site_url, reset_password_token.key),
            'site_name': site_shortcut_name,
            'site_domain': site_url
        }

        # render email text
        email_html_message = render_to_string('./frontend/email/user_reset_password.html', context)
        email_plaintext_message = render_to_string('./frontend/email/user_reset_password.txt', context)

        msg = EmailMultiAlternatives(
            # title:
            "Password Reset for {}".format(site_full_name),
            # message:
            email_plaintext_message,
            # from:
            "noreply@{}".format(site_url),
            # to:
            [reset_password_token.user.username]
        )
        msg.attach_alternative(email_html_message, "text/html")
        msg.send()


class CustomPasswordTokenVerificationView(APIView):
    """
        An Api View which provides a method to verifiy that a given pw-reset token is valid before actually confirming the
        reset.
    """
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = CustomTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']

        # get token validation time
        password_reset_token_validation_time = get_password_reset_token_expiry_time()

        # find token
        reset_password_token = ResetPasswordToken.objects.filter(key=token).first()

        if reset_password_token is None:
            return Response({'status': 'invalid'}, status=status.HTTP_404_NOT_FOUND)

        # check expiry date
        expiry_date = reset_password_token.created_at + timedelta(hours=password_reset_token_validation_time)

        if timezone.now() > expiry_date:
            # delete expired token
            reset_password_token.delete()
            return Response({'status': 'expired'}, status=status.HTTP_404_NOT_FOUND)

        # check if user has password to change
        if not reset_password_token.user.has_usable_password():
            return Response({'status': 'irrelevant'})

        return Response({'status': 'OK'})
