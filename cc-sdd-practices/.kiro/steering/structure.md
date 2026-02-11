# Project Structure

## Organization Philosophy

Standard Django project layout with a dedicated `config/` package for project-level configuration. Django apps will be added as top-level directories alongside `config/`.

## Directory Patterns

### Project Configuration
**Location**: `config/`
**Purpose**: Django project settings, root URL configuration, WSGI/ASGI entry points
**Example**: `config/settings.py`, `config/urls.py`

### Django Apps
**Location**: `<app_name>/` (top-level)
**Purpose**: Each app is a self-contained module with models, views, serializers, urls, tests
**Example**: Future apps will follow `python manage.py startapp <name>` structure

### Development Specs
**Location**: `.kiro/specs/`
**Purpose**: Spec-Driven Development artifacts (requirements, design, tasks) per feature
**Example**: `.kiro/specs/<feature>/requirements.md`

### Project Steering
**Location**: `.kiro/steering/`
**Purpose**: Persistent project memory guiding AI-assisted development
**Example**: `product.md`, `tech.md`, `structure.md`

## Naming Conventions

- **Files**: snake_case (Python/Django convention)
- **Classes**: PascalCase (models, views, serializers)
- **Functions/Variables**: snake_case
- **URLs**: kebab-case for API endpoints
- **Apps**: short, singular or plural noun (Django convention)

## Import Organization

```python
# Standard library
import os
from pathlib import Path

# Third-party
from django.db import models
from rest_framework import serializers

# Local app
from .models import MyModel
```

## Code Organization Principles

- Each Django app should be self-contained with its own models, views, serializers, urls, and tests
- App-level `urls.py` included into the root `config/urls.py` via `include()`
- Shared utilities or base classes go in a dedicated app (e.g., `core/` or `common/`) if needed
- REST API serializers live alongside the app they serialize (not in a separate API directory)

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
