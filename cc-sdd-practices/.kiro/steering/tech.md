# Technology Stack

## Architecture

Monolithic Django application with REST API layer. Standard Django MVT (Model-View-Template) pattern extended with Django REST Framework for API endpoints.

## Core Technologies

- **Language**: Python 3.13+
- **Framework**: Django 6.0
- **API Layer**: Django REST Framework 3.16
- **Database**: SQLite (development default)

## Key Libraries

- **django** — Web framework, ORM, admin, auth
- **djangorestframework** — RESTful API serialization, viewsets, routing

## Development Standards

### Code Quality
- Follow Django conventions and idioms
- Use Django's built-in security features (CSRF, auth validators, etc.)

### Testing
- Django's built-in test framework (`manage.py test`)

## Development Environment

### Required Tools
- Python 3.13+
- Poetry (dependency management, package-mode=false)
- Virtual environment (`.venv/`)

### Common Commands
```bash
# Activate venv: source .venv/bin/activate
# Dev server: python manage.py runserver
# Migrations: python manage.py migrate
# Create app: python manage.py startapp <name>
# Test: python manage.py test
# Dependencies: poetry install
```

## Key Technical Decisions

- **Poetry** over pip/requirements.txt for reproducible dependency management
- **`config/` directory** as the Django project root (instead of default project-name directory) for clearer separation of configuration from app code
- **Django REST Framework** included from the start, signaling API-first development intent
- **SQLite** for development simplicity; production database decision deferred

---
_Document standards and patterns, not every dependency_
