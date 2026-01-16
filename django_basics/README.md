# Django Basics

A practice project for learning Django fundamentals including REST APIs, testing patterns, and mocking techniques.

## Technologies

- **Django** - Python web framework
- **Django REST Framework** - Building REST APIs with serializers and class-based views
- **pytest** - Testing framework
- **pytest-django** - Django integration for pytest
- **pytest-mock** - Mocking utilities
- **requests-mock** - HTTP request mocking for API testing
- **factory-boy** - Test data generation with factories

## Key Practices

### REST API Views
- Function-based views returning JSON (`book_list`)
- Class-based generic views (`ListCreateAPIView`, `RetrieveUpdateDestroyAPIView`)
- Model serializers for data validation

### Testing with pytest

#### Mocking HTTP Requests
```python
# Using requests_mock to mock external API calls
requests_mock.register_uri(
    "POST", "https://api.example.com/posts",
    json={"id": 1}, status_code=200
)
```

#### Mocking Functions with mocker
```python
# Mock with return value
mocker.patch("module.function", return_value="mocked")

# Mock with side_effect for different responses
mock.side_effect = ["first", Exception("error"), "third"]
```

#### Factory Pattern for Test Data
```python
class BookFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "django_basics.Book"
    title = factory.Faker("sentence", nb_words=4)
    author = factory.Faker("name")
```

#### Fixture Patterns
- `autouse=True` - Automatically used for every test
- Fixture factories - Dynamically create fixtures with parameters
- Class-scoped fixtures with `scope="class"`

### Tips
- Use `@patch` decorator or `mocker.patch()` to mock dependencies
- Use `side_effect` list to return different values on consecutive calls
- Assert mock calls with `assert_called_once()`, `call_count`, `call_args`
- Capture logs with `caplog` fixture for log assertions

## Setup

### Install dependencies
```bash
poetry config virtualenvs.in-project true
poetry install
```

### Activate env
```bash
eval $(poetry env activate)
```

### Run migrations
```bash
python manage.py migrate
```

### Create admin super user
```bash
python manage.py createsuperuser
```

### Run tests
```bash
pytest
```
