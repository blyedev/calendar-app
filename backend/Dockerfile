# ===========================
# Base Stage
# ===========================
FROM python:3.12.9-slim AS base

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    pipx \
    libpq5 \
    dos2unix \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Ensure pipx apps are available in the PATH
# `pipx ensurepath` does the same but for whatever reason does not work here
ENV PATH="/root/.local/bin:$PATH"
ENV PIPX_DEFAULT_PYTHON="/usr/local/bin/python"

ENV POETRY_VERSION=1.8.5
RUN pipx install "poetry==$POETRY_VERSION"

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-interaction --no-ansi --no-root --only main

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD poetry run python manage.py health_check || exit 1

# ===========================
# Development Stage
# ===========================
FROM base AS dev

RUN poetry install --no-interaction --no-ansi --no-root

ENV DJANGO_ENV=development

WORKDIR /app

COPY . .

RUN dos2unix entrypoint.sh && chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

CMD ["python", "manage.py", "runserver_plus", "0.0.0.0:8000"]

EXPOSE 8000

# ===========================
# Production Stage
# ===========================
FROM base AS prod

### TODO: UNTESTED YET

ENV DJANGO_ENV=prod

RUN useradd -m appuser
WORKDIR /home/appuser/app

COPY --chown=appuser . .

RUN poetry run python manage.py collectstatic --noinput

USER appuser

RUN dos2unix entrypoint.sh && chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

CMD ["gunicorn", "calendar_project.wsgi:application", "--bind", "0.0.0.0:8000"]

EXPOSE 8000
