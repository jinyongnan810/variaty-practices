from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=100)  # type: ignore
    author = models.CharField(max_length=100)  # type: ignore

    def __str__(self):
        return self.title + " by " + self.author
