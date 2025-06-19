from logging import getLogger
from app.repositories.io_repository import IORepository

class DummyService():
    """
    Dummy service class that returns the input number multiplied by 2.
    """
    def __init__(self, io_repository: IORepository):
        self.io_repository = io_repository

    def multiply_by_2(self,number: int) -> int:
        """
        Dummy service that returns the input number multiplied by 2.
        """
        logger = getLogger(__name__)
        logger.info("hello world")

        self.io_repository.write("dummy.txt", "Dummy data written to file.")
        self.io_repository.delete("dummy.txt")

        return number * 2