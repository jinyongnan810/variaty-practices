from logging import getLogger
def dummy_service(number: int) -> int:
    """
    Dummy service that returns the input number multiplied by 2.
    """
    logger = getLogger(__name__)
    logger.info("hello world")
    return number * 2