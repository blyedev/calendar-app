#!/bin/bash

# Check if required environment variables are set
if [ -z "$POSTGRES_DB" ] || [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_HOST" ]; then
    echo "One or more required environment variables are not set."
    exit 1
fi

# Drop all tables in the database
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo "All tables dropped and public schema recreated."

python manage.py migrate
python manage.py createsuperuser --noinput --username root
gunicorn calendar_project.wsgi:application --bind 0.0.0.0:8000
