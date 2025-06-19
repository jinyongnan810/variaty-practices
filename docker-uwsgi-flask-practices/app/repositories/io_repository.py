from abc import ABC, abstractmethod

class IORepository(ABC):
    """
    Abstract base class for IO repositories.
    This class defines the interface for IO operations.
    """
    @abstractmethod
    def read(self, file_path: str) -> str:
        """
        Read data from a file.

        :param file_path: Path to the file to read.
        :return: Contents of the file as a string.
        """
        pass

    @abstractmethod
    def write(self, file_path: str, data: str) -> None:
        """
        Write data to a file.

        :param file_path: Path to the file to write.
        :param data: Data to write to the file.
        """
        pass

    @abstractmethod
    def delete(self, file_path: str) -> None:
        """
        Delete a file.

        :param file_path: Path to the file to delete.
        """
        pass