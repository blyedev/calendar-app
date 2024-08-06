import os
import json
import urllib.request

from .base import *


def get_env_variable(var_name, default=None):
    """Get the environment variable or print an error message."""
    try:
        return os.environ[var_name]
    except KeyError:
        error_msg = f"Environment variable {var_name} is not set."
        print(error_msg)
        return default


SECRET_KEY = get_env_variable("DJANGO_SECRET_KEY")

DEBUG = False


try:
    METADATA_URI = os.environ["ECS_CONTAINER_METADATA_URI"]
    with urllib.request.urlopen(METADATA_URI) as response:
        container_metadata = json.loads(response.read().decode())
        ip = container_metadata["Networks"][0]["IPv4Addresses"][0]
        ALLOWED_HOSTS.append(ip)
        print(f"Added host ip: {ip}")
except KeyError:
    print("ECS_CONTAINER_METADATA_URI environment variable is not defined.")
except urllib.error.URLError as e:
    print(f"An error occurred while fetching container metadata: {e}")
except (KeyError, IndexError) as e:
    print(f"An error occurred while processing container metadata: {e}")


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": get_env_variable("POSTGRES_DB"),
        "USER": get_env_variable("POSTGRES_USER"),
        "PASSWORD": get_env_variable("POSTGRES_PASSWORD"),
        "HOST": get_env_variable("POSTGRES_HOST"),
        "PORT": get_env_variable("POSTGRES_PORT", "5432"),
    }
}
