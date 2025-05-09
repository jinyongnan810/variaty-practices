FROM python:3.12-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y nginx curl build-essential python3-dev && \
    pip install --upgrade pip

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry
ENV PATH="/root/.local/bin:$PATH"
ENV POETRY_VIRTUALENVS_CREATE=false

# Copy code
COPY ./app /app
COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /app
COPY pyproject.toml .
RUN poetry install --no-root

# Expose ports
EXPOSE 80

# Add entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

