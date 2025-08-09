from typing import Final

import pytest
from rest_framework.test import APIClient

from django_basics.tests.factories.book_factory import BookFactory

INITIAL_BOOK_COUNT: Final[int] = 10


@pytest.fixture(autouse=True)
def db_setup(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        BookFactory.create_batch(INITIAL_BOOK_COUNT)

    yield
    with django_db_blocker.unblock():
        BookFactory._meta.model.objects.all().delete()


@pytest.mark.django_db(transaction=False)
class TestBookListView:
    client = APIClient()

    def test_book_list_view(self, client):
        response = client.get("/api/books")
        assert response.status_code == 200
        assert len(response.data) == INITIAL_BOOK_COUNT
