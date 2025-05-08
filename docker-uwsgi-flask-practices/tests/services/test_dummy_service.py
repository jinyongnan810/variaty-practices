import app.services.dummy_service as dummy_service

def test_function():
    result = dummy_service.dummy_service(5)
    assert result == 10