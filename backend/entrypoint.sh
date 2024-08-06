#!/bin/bash


python manage.py migrate
python manage.py createsuperuser --noinput --username root
gunicorn calendar_project.wsgi:application --bind 0.0.0.0:8000
