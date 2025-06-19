import app.services.dummy_service as dummy_service

def setup_function():
    print("Setting up the test function.")
def teardown_function():
    print("Tearing down the test function.")

def test_function(caplog):
    print("Running the test function.")
    with caplog.at_level("INFO"):
        result = dummy_service.dummy_service(5)
        assert result == 10
    assert "hello world" in caplog.text
    print ("Test function completed successfully.")

def test_function2(caplog):
    print("Running the test function.")
    with caplog.at_level("INFO"):
        result = dummy_service.dummy_service(10)
        assert result == 20
    assert "hello world" in caplog.text
    print ("Test function completed successfully.")