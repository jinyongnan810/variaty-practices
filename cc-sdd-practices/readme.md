# WiKinn - Personal Wiki Knowledge Base

A personal wiki built with Django 6 and Django REST Framework, featuring JWT authentication, tag-based organization, and keyword search.

## Prerequisites

- Python >= 3.13
- [Poetry](https://python-poetry.org/) (for dependency management)

## Initial Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd cc-sdd-practices

# 2. Install dependencies
poetry install

# 3. Activate the virtual environment
eval $(poetry env activate) 

# 4. Apply database migrations
make migrate

# 5. Create a superuser (for admin access)
make createsuperuser

# 6. Run the development server
make run
```

The server starts at `http://127.0.0.1:8000/`.

## Available Make Commands

| Command               | Description                     |
|-----------------------|---------------------------------|
| `make run`            | Start the development server    |
| `make migrate`        | Apply database migrations       |
| `make createsuperuser`| Create a Django admin superuser |
| `make test`           | Run the test suite              |

## API Endpoints

All API endpoints are under `/api/` and require JWT authentication (except token endpoints).

### Authentication

| Method | URL                  | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/token/`        | Obtain JWT access/refresh tokens |
| POST   | `/api/token/refresh/` | Refresh an access token  |

**Usage:**
```bash
# Obtain tokens
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_user", "password": "your_password"}'

# Use the access token in subsequent requests
curl http://127.0.0.1:8000/api/knowledge/ \
  -H "Authorization: Bearer <access_token>"
```

### Knowledge Entries

| Method | URL                       | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | `/api/knowledge/`         | List all knowledge entries         |
| POST   | `/api/knowledge/`         | Create a new knowledge entry       |
| GET    | `/api/knowledge/{id}/`    | Retrieve a specific entry          |
| PUT    | `/api/knowledge/{id}/`    | Update an entry                    |
| PATCH  | `/api/knowledge/{id}/`    | Partially update an entry          |
| DELETE | `/api/knowledge/{id}/`    | Delete an entry                    |

**Query parameters:**
- `search=<keyword>` - Search by title and body
- `tags=<tag_name>` - Filter by tag

### Tags

| Method | URL            | Description     |
|--------|----------------|-----------------|
| GET    | `/api/tags/`   | List all tags   |

### Admin

| URL       | Description                |
|-----------|----------------------------|
| `/admin/` | Django admin interface     |

---

## Spec-Driven Development Steps

This project was built using the cc-sdd (Spec-Driven Development) workflow:

```bash
# Install
npx cc-sdd@latest --claude --lang en
# Start claude
claude
# Create steering files
/kiro:steering
# Create spec files
/kiro:spec-init This is a WiKi for myself. Knowledge should support markdown and support crud. authentication should be bearer token. there should be tags link to each knowledge and should support searching by keywords.
# Add requirements
# Change spec.json's requirements to approved
/kiro:spec-requirements personal-wiki-knowledge-base
# Add designs
# Change spec.json's design to approved
/kiro:spec-design personal-wiki-knowledge-base
# Create tasks
# Change spec.json's task to approved
/kiro:spec-tasks personal-wiki-knowledge-base

# Start implementing
/kiro:spec-impl personal-wiki-knowledge-base 1
/kiro:spec-impl personal-wiki-knowledge-base 2
/kiro:spec-impl personal-wiki-knowledge-base 3
/kiro:spec-impl personal-wiki-knowledge-base 4
/kiro:spec-impl personal-wiki-knowledge-base 5
```
