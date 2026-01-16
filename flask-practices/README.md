# Flask Practices

Basic Flask web application examples covering routing, request handling, and concurrency control.

## Technologies

- **Flask** - Python micro web framework
- **Jinja2** - Template engine (built into Flask)

## Key Practices

### Basic Routing
```python
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
```

### Dynamic URL Parameters
```python
# String parameter
@app.route("/hello/<name>")
def hello_name(name):
    return f"<p>Hello, {name}!</p>"

# Typed parameter (int)
@app.route("/hello/<name>/<int:age>")
def hello_name_age(name, age):
    return f"<p>Hello, {name}! You are {age} years old.</p>"
```

### Multiple HTTP Methods
```python
@app.route("/bye", methods=["POST", "GET"])
def bye():
    if request.method == "POST":
        return "<p>Goodbye! post</p>"
    return "<p>Goodbye! get</p>"
```

### JSON Responses
```python
@app.route('/hello-json')
def hello_json(name=None):
    return {"hello": name or "world"}

@app.post('/name')
def add_name():
    name = request.json.get('name')
    return {"name": name}, 201
```

### HTML Templates
```python
@app.route('/hello-html/<name>')
def hello(name=None):
    return render_template('hello.html', person=name)
```

### Request Locking (Concurrency Control)
Prevent concurrent processing of the same endpoint:
```python
lock = threading.Lock()

@app.route('/process')
def process():
    if not lock.acquire(blocking=False):
        return {'status': 'busy'}, 429

    try:
        time.sleep(5)  # Long-running task
        return {'status': 'success'}
    finally:
        lock.release()
```

## Tips

- Use `app.logger.info()` for logging instead of `print()`
- Return tuples `(response, status_code)` for custom HTTP status
- Use `request.json` for parsing JSON request bodies
- Use `@app.post()` shorthand instead of `@app.route(methods=["POST"])`
- For production, use a proper WSGI server (gunicorn, uWSGI)

## Setup

```bash
# Install Flask
pip install flask

# Run development server
flask run

# Or run directly
python hello.py
```
