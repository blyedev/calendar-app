FROM python:3.12-slim AS poetry

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN pip install poetry

COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl postgresql-client && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m appuser

USER appuser
WORKDIR /home/appuser/app

ENV PATH="/home/appuser/.local/bin:$PATH"

RUN pip install --upgrade pip

COPY --from=poetry /requirements.txt .
RUN pip install -r requirements.txt

FROM base AS dev

ENV DJANGO_ENV development

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python manage.py health_check || exit 1

ENTRYPOINT ["sh", "-c", \
    "python manage.py migrate && \
    python manage.py createsuperuser --noinput --username root || true && \
    python manage.py runserver 0.0.0.0:8000"]

CMD [""]

EXPOSE 8000

FROM base AS prod

ENV DJANGO_ENV prod

COPY --chown=appuser . .
RUN python manage.py collectstatic --noinput

COPY --chown=appuser entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 8000
