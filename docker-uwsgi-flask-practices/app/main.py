import os
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api", methods=["GET"])
def index():
    return jsonify(message="Hello from Flask + uWSGI + Nginx!", key=os.getenv("API_KEY"))

if __name__ == "__main__":
    app.run()