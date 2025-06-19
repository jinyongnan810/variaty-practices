from unittest.mock import MagicMock

import app.services.dummy_service as dummy_service

def setup_function():
    print("Setting up the test function.")

def teardown_function():
    print("Tearing down the test function.")

def test_multiply_by_2():
    """
    Test the multiply_by_2 method of DummyService.
    """
    mock_io_repo = MagicMock()
    service = dummy_service.DummyService(mock_io_repo)

    # Act
    result = service.multiply_by_2(5)

    # Assert
    assert result == 10, "Expected 5 multiplied by 2 to be 10"
    mock_io_repo.write.assert_called_once_with("dummy.txt", "Dummy data written to file.")
    mock_io_repo.delete.assert_called_once_with("dummy.txt")
    mock_io_repo.read.assert_not_called(), "read should not be called in this test"

def test_multiply_by_2_calls_write_and_delete():
    """
    Ensure multiply_by_2 calls write and delete methods of IORepository.
    """
    mock_io_repo = MagicMock()
    service = dummy_service.DummyService(mock_io_repo)

    service.multiply_by_2(42)

    assert mock_io_repo.write.called, "write should be called"
    assert mock_io_repo.delete.called, "delete should be called"

def test_multiply_by_2_with_zero():
    """
    Test multiply_by_2 with zero input.
    """
    mock_io_repo = MagicMock()
    service = dummy_service.DummyService(mock_io_repo)

    result = service.multiply_by_2(0)

    assert result == 0
    mock_io_repo.write.assert_called_once()
    mock_io_repo.delete.assert_called_once()

def test_multiply_by_2_with_negative():
    """
    Test multiply_by_2 with a negative number.
    """
    mock_io_repo = MagicMock()
    service = dummy_service.DummyService(mock_io_repo)

    result = service.multiply_by_2(-3)

    assert result == -6
    mock_io_repo.write.assert_called_once()
    mock_io_repo.delete.assert_called_once()