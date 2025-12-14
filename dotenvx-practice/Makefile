env:
	eval $(poetry env activate)

encrypt:
	dotenvx encrypt -f .env.$(ENV)

decrypt:
	dotenvx decrypt -f .env.$(ENV)

set-env:
	dotenvx set $(KEY) $(VALUE) -f .env.local && \
	dotenvx set $(KEY) $(VALUE) -f .env.dev && \
	dotenvx set $(KEY) $(VALUE) -f .env.stg && \
	dotenvx set $(KEY) $(VALUE) -f .env.prod

local:
	python manage.py runserver

dev:
	python manage.py runserver

stg:
	python manage.py runserver

prod:
	python manage.py runserver