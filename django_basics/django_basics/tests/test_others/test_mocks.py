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
    """Fixture that provides a helper function to assert log messages.

    Args:
        caplog: pytest fixture for capturing log messages

    Returns:
        A function that asserts if a log message with given level and message exists
    """
    caplog.set_level(logging.INFO)

    def __assert_log(level: int, message: str):
        assert any(
            record_tuple[1] == level and record_tuple[2] == message
            for record_tuple in caplog.record_tuples
        )

    return __assert_log


@pytest.fixture
def mock_another_function(mocker):
    def get_response(message, date):
        if message == "test message" and date == "2024-12-31":
            return "hello"
        else:
            return "bye"

    return mocker.patch(
        "django_basics.tests.dummy_functions.dummy.another_function",
        side_effect=get_response,
    )


@pytest.fixture
def mock_another_functio_with_different_responses(mocker):
    with patch(
        "django_basics.tests.dummy_functions.dummy.another_function",
        side_effect=[
            "first call",
            "second call",
            Exception("mocked exception"),
            "fourth call",
        ],
    ) as mock_func:
        yield mock_func


class TestMocks:
    def test_successful_api_call_with_requests_mock(self, requests_mock, assert_log):
        """Test that a successful API call returns expected response and logs correctly.

        Verifies:
        - The function returns the mocked JSON response
        - The request was made with correct method, URL, headers, and body
        - The success is logged with appropriate INFO level message
        """
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

    def test_api_call_with_different_responses_on_consecutive_calls(
        self, requests_mock, assert_log
    ):
        """Test that multiple API calls return different responses sequentially.

        Uses response_list to mock different responses for consecutive calls:
        - First call: successful 200 response
        - Second call: 500 server error (raises HTTPError)
        - Third call: successful 200 response

        Verifies call counts and appropriate logging for each scenario.
        """
        req_mock = requests_mock.register_uri(
            "POST",
            "https://jsonplaceholder.typicode.com/posts",
            response_list=[
                {
                    "json": {"title": "first", "body": "one", "userId": 1, "id": 1},
                    "status_code": 200,
                },
                {"json": {"error": "Server Error"}, "status_code": 500},
                {
                    "json": {"title": "third", "body": "three", "userId": 1, "id": 3},
                    "status_code": 200,
                },
            ],
        )
        result = some_function_that_calls_api()

        assert result == {"title": "first", "body": "one", "userId": 1, "id": 1}
        # assert requests
        assert req_mock.call_count == 1
        call_args = req_mock.last_request
        assert call_args.method == "POST"
        assert call_args.url == "https://jsonplaceholder.typicode.com/posts"
        assert call_args.headers["Content-Type"] == "application/json"
        assert call_args.headers["Accept"] == "application/json"
        assert call_args.json() == {
            "title": "foo",
            "body": "bar",
            "userId": 1,
        }
        assert_log(logging.INFO, "Response status code: 200")

        with pytest.raises(requests.exceptions.HTTPError):
            result = some_function_that_calls_api()
        assert req_mock.call_count == 2
        assert_log(logging.ERROR, "HTTP error occurred")

        result = some_function_that_calls_api()
        assert result == {"title": "third", "body": "three", "userId": 1, "id": 3}
        assert req_mock.call_count == 3
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
    def test_api_error_responses_with_mocked_logger(
        self, mock_logger, requests_mock, status_code, body
    ):
        """Test that various HTTP error responses raise exceptions and log errors.

        Parametrized test covering common HTTP error status codes (400, 404, 500).
        Verifies that:
        - HTTPError is raised for error status codes
        - Logger.exception is called exactly once for error handling
        """
        requests_mock.register_uri(
            "POST",
            "https://jsonplaceholder.typicode.com/posts",
            json=body,
            status_code=status_code,
        )

        with pytest.raises(requests.exceptions.HTTPError):
            some_function_that_calls_api()

        mock_logger.exception.assert_called_once()

    def test_mock_function_with_mocker_fixture(self, mocker):
        """Test mocking a function using pytest-mock's mocker fixture.

        Demonstrates mocking with mocker.patch and verifying return value.
        """
        mocker.patch(
            "django_basics.tests.dummy_functions.dummy.another_function",
            return_value="mocked value",
        )

        result = call_another_function()
        assert result == "mocked value"

    @patch("django_basics.tests.dummy_functions.dummy.another_function")
    def test_mock_function_with_patch_decorator(self, mock_another_function, mocker):
        """Test mocking a function using unittest.mock.patch decorator.

        Demonstrates using @patch decorator to mock a function and verify:
        - The mocked return value is used
        - The mock was called exactly once
        """
        mock_another_function.return_value = "mocked value"

        result = call_another_function()
        assert result == "mocked value"
        assert mock_another_function.call_count == 1
        call_args = mock_another_function.call_args
        assert call_args.args == ("hi there", "2024-10-01")

    @patch("django_basics.tests.dummy_functions.dummy.another_function")
    def test_mock_function_with_side_effect_returning_different_values(
        self, mock_another_function, mocker
    ):
        """Test using side_effect to return different values on consecutive calls.

        Demonstrates mock.side_effect with a list of values/exceptions:
        - First call: returns "mocked value"
        - Second call: raises Exception("mocked error")
        - Third call: returns "another mocked value"

        Verifies call count increments properly after each invocation.
        """
        mock_another_function.side_effect = [
            "mocked value",
            Exception("mocked error"),
            "another mocked value",
        ]

        result = call_another_function()
        assert result == "mocked value"
        assert mock_another_function.call_count == 1

        with pytest.raises(Exception, match="mocked error"):
            call_another_function()
        assert mock_another_function.call_count == 2

        result = call_another_function()
        assert result == "another mocked value"
        assert mock_another_function.call_count == 3

    def test_mock_function_raising_exception_with_side_effect(self, mocker):
        """Test mocking a function to raise an exception using side_effect.

        Demonstrates using mocker.patch with side_effect to make a mocked
        function always raise an exception when called.
        """
        mocker.patch(
            "django_basics.tests.dummy_functions.dummy.another_function",
            side_effect=Exception("Mocked exception"),
        )
        with pytest.raises(Exception, match="Mocked exception"):
            call_another_function()

    def test_mock_function_with_different_arguments(self, mock_another_function):
        """Test mocking a function and verifying calls with different arguments.
        Demonstrates that the mocked function returns different values based
        on the input arguments and verifies the call arguments.
        """
        result = call_another_function()
        assert result == "bye"
        assert mock_another_function.call_count == 1
        call_args = mock_another_function.call_args
        assert call_args.args == ("hi there", "2024-10-01")

        result = call_another_function(message="test message", date="2024-12-31")
        assert result == "hello"
        assert mock_another_function.call_count == 2
        call_args = mock_another_function.call_args
        assert call_args.args == ("test message", "2024-12-31")

    def test_mock_function_with_different_responses_on_consecutive_calls(
        self, mock_another_functio_with_different_responses
    ):
        """Test mocking a function to return different responses on consecutive calls.

        Demonstrates using side_effect with a list of return values/exceptions
        to simulate different behaviors on each call.
        """
        result = call_another_function()
        assert result == "first call"
        assert mock_another_functio_with_different_responses.call_count == 1

        result = call_another_function()
        assert result == "second call"
        assert mock_another_functio_with_different_responses.call_count == 2

        with pytest.raises(Exception, match="mocked exception"):
            call_another_function()
        assert mock_another_functio_with_different_responses.call_count == 3

        result = call_another_function()
        assert result == "fourth call"
        assert mock_another_functio_with_different_responses.call_count == 4
