# Docker uWSGI Flask Practices

A production-ready Flask application setup with uWSGI and Nginx running in Docker.

## Technologies

- **Flask** - Python micro web framework
- **uWSGI** - Application server for Python web apps
- **Nginx** - Reverse proxy server
- **Docker / Docker Compose** - Containerization
- **Poetry** - Python dependency management
- **pytest** - Testing framework

## Architecture

```
Client -> Nginx (port 80) -> uWSGI (Unix socket) -> Flask App
```

## Key Practices

### uWSGI Configuration
```ini
[uwsgi]
module = main:app
master = true
processes = 4
socket = /tmp/uwsgi.sock
chmod-socket = 666
vacuum = true
die-on-term = true
enable-threads = true
```

**Tips:**
- `master = true` - Enable master process for worker management
- `processes = 4` - Number of worker processes
- `socket` - Unix socket for Nginx communication (faster than TCP)
- `vacuum = true` - Clean up socket file on exit
- `enable-threads = true` - Required if using threading in Flask

### Repository Pattern
Dependency injection pattern for testability:
```python
class DummyService:
    def __init__(self, io_repo: IORepository):
        self.io_repo = io_repo
```

### Testing with MagicMock
```python
def test_service():
    mock_io_repo = MagicMock()
    service = DummyService(mock_io_repo)

    result = service.multiply_by_2(5)

    assert result == 10
    mock_io_repo.write.assert_called_once()
    mock_io_repo.read.assert_not_called()
```

### Environment Variables
Using `env_file` in docker-compose for configuration:
```yaml
services:
  flask:
    env_file:
      - ./envs/runtime.env
```

## Setup

### Run with Docker Compose
```bash
docker-compose up --build
```

### Run tests
```bash
pytest
```

### Access the API
```bash
curl http://localhost/api
```
