# Setup

## Install dependencies

```
poetry config virtualenvs.in-project true
poetry install
```

## Activate env

```
eval $(poetry env activate)
```

## Create admin super user

```
python manage.py createsuperuser
```
