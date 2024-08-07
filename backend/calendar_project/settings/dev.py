import os
from .base import *

SECRET_KEY = "django-insecure-&wtt80y-1q89ox=t&u^#s!t3s@%sc(i8uwin77h-5sra5$+y6y"

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB", "your_db_name"),
        "USER": os.environ.get("POSTGRES_USER", "your_db_user"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "your_db_password"),
        "HOST": os.environ.get("POSTGRES_HOST", "db"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}
