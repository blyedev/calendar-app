FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

RUN useradd -m appuser;
ENV PATH="/home/appuser/.local/bin:$PATH"

USER appuser
WORKDIR /home/appuser/app

COPY --chown=appuser requirements.txt .
RUN pip install -r requirements.txt

COPY --chown=appuser . .

ENV DJANGO_ENV prod

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["/bin/bash", "-c", "python manage.py migrate && gunicorn calendar_project.wsgi:application --bind 0.0.0.0:8000"]
