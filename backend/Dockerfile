# ===========================
# Base Stage
# ===========================
FROM python:3.12.10-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_NO_MANAGED_PYTHON=1 \
    UV_PYTHON_DOWNLOADS=never \
    UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    dos2unix \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.8.8 /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN uv sync --locked --no-dev

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD uv run python manage.py health_check || exit 1

# ===========================
# Development Stage
# ===========================
FROM base AS dev

ENV DJANGO_ENV=development

WORKDIR /app

COPY . .

RUN dos2unix entrypoint.sh && chmod +x entrypoint.sh

RUN uv sync --locked

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

RUN uv run python manage.py collectstatic --noinput

USER appuser

RUN dos2unix entrypoint.sh && chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

CMD ["gunicorn", "calendar_project.wsgi:application", "--bind", "0.0.0.0:8000"]

EXPOSE 8000
