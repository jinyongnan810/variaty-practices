import logging

import requests

from django_basics.tests.dummy_functions.other_dummy import another_function

logger = logging.getLogger(__name__)


def some_function_that_calls_api():
    header = {"Content-Type": "application/json", "Accept": "application/json"}
    body = {
        "title": "foo",
        "body": "bar",
        "userId": 1,
    }
    try:
        response = requests.post(
            "https://jsonplaceholder.typicode.com/posts", headers=header, json=body
        )
        response.raise_for_status()
        logger.info(f"Response status code: {response.status_code}")
        return response.json()
    except requests.exceptions.HTTPError:
        logger.exception("HTTP error occurred")
        raise
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        raise


def call_another_function():

    return another_function()
