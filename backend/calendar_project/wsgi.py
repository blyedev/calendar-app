"""
WSGI config for calendar-app project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

env = os.getenv("DJANGO_ENV", "development")
settings_module = (
    "calendar_project.settings.dev"
    if env == "development"
    else "calendar_project.settings.prod"
)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

application = get_wsgi_application()
