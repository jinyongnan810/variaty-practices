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
	dotenvx run -f .env -- python manage.py runserver

dev:
	dotenvx run -f .env.dev -- python manage.py runserver

stg:
	dotenvx run -f .env.stg -- python manage.py runserver

prod:
	dotenvx run -f .env.prod -- python manage.py runserver
