import logging
from unittest.mock import patch

import pytest
import requests

from django_basics.tests.dummy_functions.dummy import (
    call_another_function,
    some_function_that_calls_api,
)


@pytest.fixture
def assert_log(caplog):
    caplog.set_level(logging.INFO)

    def __assert_log(level: int, message: str):
        assert any(
            record_tuple[1] == level and record_tuple[2] == message
            for record_tuple in caplog.record_tuples
        )

    return __assert_log


class TestMocks:
    def test_dummy_normal(self, requests_mock, assert_log):
        req_mock = requests_mock.register_uri(
            "POST",
            "https://jsonplaceholder.typicode.com/posts",
            json={"title": "foo", "body": "bar", "userId": 1, "id": 101},
            status_code=200,
        )
        result = some_function_that_calls_api()

        assert result == {"title": "foo", "body": "bar", "userId": 1, "id": 101}
        # assert requests
        assert req_mock.called
        assert req_mock.call_count == 1
        assert req_mock.last_request.method == "POST"
        assert req_mock.last_request.url == "https://jsonplaceholder.typicode.com/posts"
        assert req_mock.last_request.headers["Content-Type"] == "application/json"
        assert req_mock.last_request.headers["Accept"] == "application/json"
        assert req_mock.last_request.json() == {
            "title": "foo",
            "body": "bar",
            "userId": 1,
        }
        # assert log
        assert_log(logging.INFO, "Response status code: 200")

    @patch("django_basics.tests.dummy_functions.dummy.logger")
    @pytest.mark.parametrize(
        "status_code,body",
        [
            (400, {"error": "Bad Request"}),
            (404, {"error": "Not Found"}),
            (500, {"error": "Internal Server Error"}),
        ],
    )
    def test_dummy_mocked(self, mock_logger, requests_mock, status_code, body):
        requests_mock.register_uri(
            "POST",
            "https://jsonplaceholder.typicode.com/posts",
            json=body,
            status_code=status_code,
        )

        with pytest.raises(requests.exceptions.HTTPError):
            some_function_that_calls_api()

        mock_logger.exception.assert_called_once()

    def test_dummy_mocked_another_function(self, mocker):
        mocker.patch(
            "django_basics.tests.dummy_functions.dummy.another_function",
            return_value="mocked value",
        )

        result = call_another_function()
        assert result == "mocked value"
