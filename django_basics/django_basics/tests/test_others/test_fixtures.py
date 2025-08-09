import pytest


@pytest.fixture(autouse=True)
def auto_use_fixture():
    print("auto_use_fixture.")
    yield
    print("auto_use_fixture teardown.")


@pytest.fixture
def non_auto_use_fixture():
    print("non_auto_use_fixture.")
    yield
    print("non_auto_use_fixture teardown.")


@pytest.fixture
def fixture_factory():
    def _manual_fixture(name: str):
        print(f"Creating fixture: {name}")

    return _manual_fixture


class TestFixtures:
    @pytest.fixture(scope="class", autouse=True)
    def class_auto_use_fixture(self):
        print("class_auto_use_fixture.")
        yield
        print("class_auto_use_fixture teardown.")

    def test_fixture1(self):
        print("Running test_fixture1")

    def test_fixture2(self, non_auto_use_fixture):
        print("Running test_fixture2 with non_auto_use_fixture")

    def test_fixture_factory(self, fixture_factory):
        fixture_factory("hello1!")
        fixture_factory("hello2!")
        print("Running test_fixture_factory")
