"""
Django settings for calendar app project.
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "django-insecure-&wtt80y-1q89ox=t&u^#s!t3s@%sc(i8uwin77h-5sra5$+y6y")

# Django has nice defaults for an empty ALLOWED_HOSTS while debug is true
raw_hosts: str = os.getenv("DJANGO_ALLOWED_HOSTS", "")
ALLOWED_HOSTS: list[str] = raw_hosts.split(",") if raw_hosts else []

# These defaults exisits purely so mypy doesn't fail because of unset env vars
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB", "default_db_name"),
        "USER": os.getenv("POSTGRES_USER", "default_user"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "default_password"),
        "HOST": os.getenv("POSTGRES_HOST", "default_host"),
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
    }
}

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Originally existed for healthcheks on ecs but it's not necessary at the moment
#
# if not DEBUG:
#     try:
#         METADATA_URI = os.environ["ECS_CONTAINER_METADATA_URI"]
#         with urllib.request.urlopen(METADATA_URI) as response:
#             container_metadata = json.loads(response.read().decode())
#             ip = container_metadata["Networks"][0]["IPv4Addresses"][0]
#             ALLOWED_HOSTS.append(ip)
#             print(f"Added host ip: {ip}")
#     except KeyError:
#         print("ECS_CONTAINER_METADATA_URI environment variable is not defined.")
#     except urllib.error.URLError as e:
#         print(f"An error occurred while fetching container metadata: {e}")


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "health_check",
    "health_check.db",
    "health_check.cache",
    "health_check.contrib.migrations",
    "allauth",
    "allauth.account",
    "allauth.headless",
    # 'allauth.socialaccount',
    # 'allauth.mfa',
    # 'allauth.usersessions',
    "rest_framework",
    "calendar_app",
]

if DEBUG:
    INSTALLED_APPS += [
        "django_extensions",
    ]

CSRF_TRUSTED_ORIGINS = ["https://calendar.blyedev.com"]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]


ROOT_URLCONF = "calendar_project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

HEADLESS_ONLY = True

# These are the URLs to be implemented by your single-page application.
HEADLESS_FRONTEND_URLS = {
    "account_confirm_email": "https://app.project.org/account/verify-email/{key}",
    "account_reset_password_from_key": "https://app.org/account/password/reset/key/{key}",
    "account_signup": "https://app.org/account/signup",
}

ACCOUNT_AUTHENTICATION_METHOD = "username_email"

WSGI_APPLICATION = "calendar_project.wsgi.application"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = Path(BASE_DIR) / "staticfiles"

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
