#!/bin/bash

set -e

uv run python manage.py migrate --noinput
uv run python manage.py createsuperuser --noinput --username root || true
exec uv run "$@"
