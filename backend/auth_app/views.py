from django.contrib.auth import login
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from knox.views import LoginView as KnoxLoginView
from knox.views import LogoutAllView as KnoxLogoutView
from rest_framework import permissions, status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.settings import api_settings


class CheckAuthenticationView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        is_authenticated = request.user.is_authenticated
        response_data = {"is_authenticated": is_authenticated}
        return Response(response_data, status=status.HTTP_200_OK)


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return super(LoginView, self).post(request, format=None)


class LogoutView(KnoxLogoutView):
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
