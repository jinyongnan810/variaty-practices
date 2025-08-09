from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics

from .models import Book
from .serializers import BookSerializer


# Function-based view to return a list of books
def book_list(request):
    books = Book.objects.all().values("id", "title", "author")  # QuerySet of dicts
    return JsonResponse(list(books), safe=False)


# Class-based views for CRUD operations
class BookListCreateAPIView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class BookRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


def redoc_view(request):
    return render(request, "redoc.html")
