import os
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api")
def index():
    return jsonify(message="Hello from Flask + uWSGI + Nginx!", key=os.getenv("API_KEY"))