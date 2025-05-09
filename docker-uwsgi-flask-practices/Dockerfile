FROM python:3.12-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y nginx build-essential python3-dev && \
    pip install --upgrade pip

# Copy code
COPY ./app /app
COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /app
RUN pip install -r requirements.txt

# Expose ports
EXPOSE 80

# Add entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

