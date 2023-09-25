FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
RUN pip install --upgrade pip
COPY requirements.txt /code/

RUN pip install -r requirements.txt
COPY . /code/

RUN python manage.py migrate

ENV DJANGO_SUPERUSER_PASSWORD dev
RUN python manage.py createsuperuser --noinput --username dev 

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]