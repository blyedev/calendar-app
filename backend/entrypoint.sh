#!/bin/bash

# Run migrations
python manage.py migrate

# Attempt to create the superuser
echo "Creating superuser 'root'..."
python manage.py createsuperuser --noinput --username root --email $DJANGO_SUPERUSER_EMAIL || echo "Superuser 'root' already exists."

# Check if the superuser exists
SUPERUSER_EXISTS=$(python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); print(User.objects.filter(username='root').exists())")

echo "Superuser credentials:"
echo "Username: root"
echo "Email: $DJANGO_SUPERUSER_EMAIL"
echo "Password: $DJANGO_SUPERUSER_PASSWORD"

if [ "$SUPERUSER_EXISTS" == "True" ]; then
  echo "Superuser 'root' exists."
else
  echo "Failed to create superuser 'root'."
fi

# Start the application
gunicorn calendar_project.wsgi:application --bind 0.0.0.0:8000
