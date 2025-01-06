#!/bin/bash

set -e

poetry run python manage.py migrate --noinput
poetry run python manage.py createsuperuser --noinput --username root || true
exec poetry run "$@"
