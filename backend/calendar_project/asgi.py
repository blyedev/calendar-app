"""
ASGI config for calendar-app project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

env = os.getenv("DJANGO_ENV", "development")
settings_module = "calendar_project.settings.dev" if env == "development" else "calendar_project.settings.prod"
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

application = get_asgi_application()
