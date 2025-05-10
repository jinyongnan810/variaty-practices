import os
import pytest
from app.main import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_api_endpoint(client):
    response = client.get("/api")
    assert response.status_code == 200
    assert response.json == {"message": "Hello from Flask + uWSGI + Nginx!", "key": os.getenv("API_KEY")}
