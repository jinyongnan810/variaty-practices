migrate:
	python manage.py makemigrations django_basics
	python manage.py makemigrations
	python manage.py migrate

start:
	python manage.py runserver

activate:
	eval $(poetry env activate)

lint:
	poetry run isort .
	poetry run black .
	poetry run flake8 django_basics
	poetry run mypy django_basics 

test:
	poetry run pytest -s --cov=django_basics --cov-report=html