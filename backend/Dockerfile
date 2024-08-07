FROM python:3.12-slim as base

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m appuser;

USER appuser
WORKDIR /home/appuser
# RUN chown -R appuser:appuser .

ENV PATH="/home/appuser/.local/bin:$PATH"

RUN pip install --upgrade pip

COPY --chown=appuser requirements.txt .
RUN pip install -r requirements.txt

FROM base as dev

ENV DJANGO_ENV development

ENTRYPOINT ["sh", "-c", \
    "python manage.py migrate && \
    python manage.py createsuperuser --noinput --username root || true && \
    python manage.py runserver 0.0.0.0:8000"]

CMD [""]

EXPOSE 8000

FROM base as prod

ENV DJANGO_ENV prod

COPY --chown=appuser . .
RUN python manage.py collectstatic --noinput

# COPY --chown=appuser entrypoint.sh .
# RUN chmod +x entrypoint.sh

ENTRYPOINT ["sh", "-c", \
    "python manage.py migrate && \
    python manage.py createsuperuser --noinput --username root || true && \
    gunicorn calendar_project.wsgi:application --bind 0.0.0.0:8000"]

EXPOSE 8000
