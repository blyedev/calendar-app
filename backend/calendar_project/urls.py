"""
URL configuration for calendar-app project.
"""

from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView

urlpatterns = [
    path("ht/", include("health_check.urls")),
    path("admin/", admin.site.urls),
    path("", RedirectView.as_view(url="api/", permanent=False)),
    path("api/auth/", include("auth_app.urls")),
    path("api/", include("calendar_app.urls")),
]
