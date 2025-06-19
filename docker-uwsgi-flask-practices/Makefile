build:
	docker-compose up --build

start:
	docker-compose up

detach:
	docker-compose -f docker-compose.yml -d

stop:
	docker-compose down

clear:
	docker-compose down --volumes --remove-orphans --rmi all

test:
	poetry run pytest -s

flask:
	./run_flask.sh