import app.services.dummy_service as dummy_service

def test_function(caplog):
    with caplog.at_level("INFO"):
        result = dummy_service.dummy_service(5)
        assert result == 10
    assert "hello world" in caplog.text