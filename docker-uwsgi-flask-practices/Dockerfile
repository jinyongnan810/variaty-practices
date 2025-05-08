FROM python:3.11-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y nginx build-essential python3-dev && \
    pip install --upgrade pip

# Copy code
WORKDIR /app
COPY app /app
COPY requirements.txt .
RUN pip install -r requirements.txt

# uWSGI config
COPY uwsgi.ini .

# Nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 80

CMD ["/start.sh"]
