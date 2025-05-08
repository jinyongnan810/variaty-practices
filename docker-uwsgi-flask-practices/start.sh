#!/bin/bash
# Start uWSGI in background
uwsgi --ini uwsgi.ini &

# Start Nginx in foreground
nginx -g "daemon off;"
