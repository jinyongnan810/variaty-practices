# 🎯 Variaty Practices

A comprehensive collection of practical examples and best practices across multiple programming languages, frameworks, and tools. This repository serves as a hands-on reference for developers learning different technologies and patterns.

## 📚 Table of Contents

- [Backend Web Frameworks](#backend-web-frameworks)
- [Frontend & Full-Stack](#frontend--full-stack)
- [Data Analysis & Visualization](#data-analysis--visualization)
- [Testing Practices](#testing-practices)
- [DevOps & Infrastructure](#devops--infrastructure)
- [Documentation & Design](#documentation--design)
- [Python Advanced Techniques](#python-advanced-techniques)

---

## 🖥️ Backend Web Frameworks

### [Django Basics](django_basics)

**Tech Stack:** [Django](https://github.com/django/django) · [Django REST Framework](https://github.com/encode/django-rest-framework) · [pytest](https://github.com/pytest-dev/pytest)

Comprehensive Django project demonstrating:

- Model definitions and migrations
- Admin interface configuration with [django.contrib.admin](https://docs.djangoproject.com/en/stable/ref/contrib/admin/)
- REST API endpoints with Django REST Framework
- API documentation with [drf-yasg](https://github.com/axnsan12/drf-yasg) (Swagger/OpenAPI)
- Advanced testing patterns:
  - Test fixtures and database isolation with [pytest-django](https://github.com/pytest-dev/pytest-django)
  - Mock functions with [pytest-mock](https://github.com/pytest-dev/pytest-mock)
  - Time mocking with [pytest-freezegun](https://github.com/ktosiek/pytest-freezegun)
  - Factory patterns with [factory-boy](https://github.com/FactoryBoy/factory_boy)
  - API mocking with [requests-mock](https://github.com/jamielennox/requests-mock)
  - Test coverage with [pytest-cov](https://github.com/pytest-dev/pytest-cov)

**Key Learnings:** Django models, DRF serializers, comprehensive testing strategies

---

### [Docker + uWSGI + Flask](docker-uwsgi-flask-practices)

**Tech Stack:** [Flask](https://github.com/pallets/flask) · [uWSGI](https://github.com/unbit/uwsgi) · [Docker](https://github.com/docker/docker-ce) · [Nginx](https://github.com/nginx/nginx) · [Poetry](https://github.com/python-poetry/poetry)

Production-ready Flask REST API deployment:

- Service layer architecture with Flask
- [uWSGI](https://uwsgi-docs.readthedocs.io/) application server configuration
- [Nginx](https://nginx.org/) reverse proxy setup
- [Docker Compose](https://github.com/docker/compose) orchestration
- Dependency management with Poetry
- Comprehensive test suite for services and API endpoints

**Key Learnings:** Production Flask deployment, containerization, service architecture

---

### [Flask Practices](flask-practices)

**Tech Stack:** [Flask](https://github.com/pallets/flask) · [Jinja2](https://github.com/pallets/jinja)

Basic Flask examples:

- Returning text, JSON, and HTML responses
- Template rendering with Jinja2
- Thread and process locking patterns
- Simple REST endpoint patterns

**Key Learnings:** Flask fundamentals, template rendering, basic API design

---

### [dotenvx Practice](dotenvx-practice)

**Tech Stack:** [dotenvx](https://github.com/dotenvx/dotenvx) · [Django](https://github.com/django/django)

Environment variable management across multiple environments:

- Multi-environment setup (local, dev, staging, production)
- Encryption/decryption of sensitive environment files with dotenvx
- Custom shell script (`env.sh`) for environment-specific config loading
- Secure configuration management patterns

**Key Learnings:** Environment management, secrets encryption, multi-stage configurations

---

## 🎨 Frontend & Full-Stack

### [Next.js Practices](nextjs-practices)

**Tech Stack:** [Next.js](https://github.com/vercel/next.js) · [React](https://github.com/facebook/react) · [TypeScript](https://github.com/microsoft/TypeScript) · [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)

Modern Next.js 15 application with:

- [React 19](https://react.dev/) with Server Components
- [TypeScript 5](https://www.typescriptlang.org/) for type safety
- Styling with [Tailwind CSS 4](https://tailwindcss.com/)
- Unit testing with [Jest](https://github.com/jestjs/jest) and [@testing-library/react](https://github.com/testing-library/react-testing-library)
- E2E testing with [Playwright](https://github.com/microsoft/playwright)
- Snapshot testing patterns
- [ESLint](https://github.com/eslint/eslint) for code quality
- [Turbopack](https://turbo.build/pack) for faster builds

**Key Learnings:** Modern React patterns, TypeScript integration, comprehensive testing strategies

---

## 📊 Data Analysis & Visualization

### [Pandas Practices](pandas-practices)

**Tech Stack:** [Pandas](https://github.com/pandas-dev/pandas) · [Jupyter](https://github.com/jupyter/notebook)

Data manipulation and analysis with Pandas:

- Data loading and transformation
- DataFrame operations
- Data cleaning techniques

**Key Learnings:** Pandas fundamentals, data manipulation patterns

---

### [Polars Practices](polars-practices)

**Tech Stack:** [Polars](https://github.com/pola-rs/polars) · [Jupyter](https://github.com/jupyter/notebook)

High-performance data processing:

- Multi-parquet file handling
- Performance comparison with Pandas
- Efficient data transformations with Polars

**Key Learnings:** High-performance data processing, Polars vs Pandas patterns

---

### [Graph Practices](graph-practices)

**Tech Stack:** [Matplotlib](https://github.com/matplotlib/matplotlib) · [Jupyter](https://github.com/jupyter/notebook)

Data visualization techniques:

- Plotting value distributions
- Histogram creation
- Data visualization best practices

**Key Learnings:** Data visualization, plotting techniques

---

## 🧪 Testing Practices

Comprehensive testing patterns demonstrated across multiple projects:

- **Unit Testing:** pytest, Jest, @testing-library
- **Mocking:** pytest-mock, requests-mock, patch decorator
- **E2E Testing:** Playwright with trace viewer
- **Snapshot Testing:** Jest snapshots
- **Factory Patterns:** factory-boy for test data
- **Time Mocking:** pytest-freezegun
- **Parametrized Tests:** pytest parametrize
- **Coverage Tracking:** pytest-cov

---

## 🔧 DevOps & Infrastructure

### [Shell Practices](shell-practices)

**Tech Stack:** [Bash](https://www.gnu.org/software/bash/)

Bash scripting utilities:

- File export automation
- Batch file renaming scripts
- Shell scripting best practices

**Key Learnings:** Bash automation, shell scripting patterns

---

## 📐 Documentation & Design

### [PlantUML Practices](plantuml-practices)

**Tech Stack:** [PlantUML](https://github.com/plantuml/plantuml)

UML sequence diagram examples:

- Actor definitions and interactions
- Sequence flows and lifelines
- Annotations and note stickers
- Phase groupings

**Key Learnings:** Sequence diagram design, architecture documentation

---

### [JSON Schema Practices](json-schema-practices)

**Tech Stack:** [jsonschema](https://github.com/python-jsonschema/jsonschema) · [Jupyter](https://github.com/jupyter/notebook)

JSON format validation:

- Schema definition patterns
- JSON validation techniques
- Data contract enforcement

**Key Learnings:** JSON schema validation, API contract design

---

## 🐍 Python Advanced Techniques

### [Python Practices](python-practices)

Advanced Python patterns and techniques:

#### [Lock Practices](python-practices/lock-practices)

**Tech Stack:** [fasteners](https://github.com/harlowja/fasteners) · [threading](https://docs.python.org/3/library/threading.html)

Concurrency and synchronization:

- Thread locks with threading primitives
- Process locks with fasteners
- Synchronization patterns

#### [Thread Pool Practices](python-practices/thread-pool-practices)

**Tech Stack:** [concurrent.futures](https://docs.python.org/3/library/concurrent.futures.html)

Concurrent execution patterns:

- Thread pool executors
- Parallel task execution

#### [Pydantic Practices](python-practices/pydantic-practices.ipynb)

**Tech Stack:** [Pydantic](https://github.com/pydantic/pydantic)

Data validation and parsing:

- Model definitions
- Data validation patterns
- Type safety with Pydantic

**Key Learnings:** Concurrency patterns, data validation, Python advanced features

---

## 🚀 Getting Started

Each practice directory contains its own README or notebook with specific setup instructions. General requirements:

### Python Projects

```bash
# Using Poetry (recommended for docker-uwsgi-flask-practices)
poetry install
poetry shell

# Using pip
pip install -r requirements.txt  # or requirements-dev.txt
```

### Node.js Projects

```bash
# Next.js practices
npm install
npm run dev
npm test
npm run test:e2e
```

### Jupyter Notebooks

```bash
jupyter notebook
# Or use VS Code with Jupyter extension
```

---

## 📝 Technologies Summary

| Category     | Technologies                                         |
| ------------ | ---------------------------------------------------- |
| **Backend**  | Django, Django REST Framework, Flask, uWSGI          |
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS             |
| **Testing**  | pytest, Jest, Playwright, requests-mock, pytest-mock |
| **Data**     | Pandas, Polars, Matplotlib, Jupyter                  |
| **DevOps**   | Docker, Docker Compose, Nginx, Poetry                |
| **Tools**    | dotenvx, PlantUML, jsonschema, Pydantic, fasteners   |
| **Quality**  | ESLint, mypy, black, flake8, isort, pytest-cov       |

---

## 🤝 Contributing

This is a personal learning repository, but suggestions and improvements are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is for educational purposes. Individual technologies used may have their own licenses.
