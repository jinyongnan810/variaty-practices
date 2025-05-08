FROM python:3.11-slim

WORKDIR /app

COPY app /app
COPY uwsgi/uwsgi.ini /app/uwsgi.ini

RUN apt-get update && apt-get install -y build-essential python3-dev
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["uwsgi", "--ini", "uwsgi.ini"]
