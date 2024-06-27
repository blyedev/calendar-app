from .base import *

SECRET_KEY = "django-insecure-&wtt80y-1q89ox=t&u^#s!t3s@%sc(i8uwin77h-5sra5$+y6y"

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = ["http://localhost:4200", "http://127.0.0.1:4200"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
