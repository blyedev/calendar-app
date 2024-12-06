"""
URL configuration for authentication via knox.
"""

from django.urls import include, path

from .views import CheckAuthenticationView, LoginView, LogoutView

urlpatterns = [
    path(r"check", CheckAuthenticationView.as_view(), name="check_auth"),
    path(r"rest/", include("rest_framework.urls")),
    path(r"knox/login/", LoginView.as_view(), name="knox_login"),
    path(r"knox/logout/", LogoutView.as_view(), name="knox_logout"),
    # path(r"knox/logoutall/", knox_views.LogoutAllView.as_view(), name="knox_logoutall"),
]
