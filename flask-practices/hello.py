from flask import Flask
from flask import request
from flask import render_template

app = Flask(__name__)

@app.route("/")
def hello_world():
    app.logger.info("Hello, World! endpoint was called")
    return "<p>Hello, World!</p>"

@app.route("/hello/<name>")
def hello_name(name):
    return f"<p>Hello, {name}!</p>"

@app.route("/hello/<name>/<int:age>")
def hello_name_age(name, age):
    return f"<p>Hello, {name}! You are {age} years old.</p>"

@app.route("/bye", methods=["POST", "GET"])
def bye():
    if request.method == "POST":
        return "<p>Goodbye! post</p>"
    return "<p>Goodbye! get</p>"

@app.route('/hello-html/')
@app.route('/hello-html/<name>')
def hello(name=None):
    return render_template('hello.html', person=name)

@app.route('/hello-json')
@app.route('/hello-json/<name>')
def hello_json(name=None):
    if name:
        return {"hello": name}
    else:
        return {"hello": "world"}
    
@app.post('/name')
def add_name():
    name = request.json.get('name')
    return {"name": name}, 201