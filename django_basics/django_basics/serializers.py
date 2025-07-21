from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"

    def validate(self, data):
        title = data.get("title")
        author = data.get("author")
        print(f"Validating book: {title} by {author}")

        if title and author and title.strip().lower() == author.strip().lower():
            raise serializers.ValidationError(
                "Book name and author cannot be the same."
            )

        return data

    def validate_author(self, value):
        print(f"Validating author: {value}")
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Author name must be at least 3 characters long."
            )
        return value
