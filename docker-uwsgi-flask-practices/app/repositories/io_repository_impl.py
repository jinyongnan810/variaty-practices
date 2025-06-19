from app.repositories.io_repository import IORepository

class IORepositoryImpl(IORepository):
    """
    Implementation of the IORepository interface.
    This class provides concrete implementations for reading and writing files.
    """

    def read(self, file_path: str) -> str:
        """
        Read data from a file.

        :param file_path: Path to the file to read.
        :return: Contents of the file as a string.
        """
        with open(file_path, 'r') as file:
            return file.read()

    def write(self, file_path: str, data: str) -> None:
        """
        Write data to a file.

        :param file_path: Path to the file to write.
        :param data: Data to write to the file.
        """
        with open(file_path, 'w') as file:
            file.write(data)

    def delete(self, file_path: str) -> None:
        """
        Delete a file.

        :param file_path: Path to the file to delete.
        """
        import os
        if os.path.exists(file_path):
            os.remove(file_path)
        else:
            raise FileNotFoundError(f"The file {file_path} does not exist.")