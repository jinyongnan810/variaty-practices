import time
from datetime import datetime, timedelta, timezone

import pytest

JST = timezone(timedelta(hours=+9), "JST")


@pytest.mark.freeze_time(datetime(2025, 1, 1, 12, 0, 0, tzinfo=JST))
class TestTime:
    def test_time(self):
        assert datetime.now(tz=JST) == datetime(2025, 1, 1, 12, 0, 0, tzinfo=JST)
        assert datetime.now() == datetime(2025, 1, 1, 3, 0, 0)
        assert int(time.time()) == 1735700400
