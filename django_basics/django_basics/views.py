from django.http import JsonResponse
from .models import Book

def book_list(request):
    books = Book.objects.all().values('id', 'title', 'author')  # QuerySet of dicts
    return JsonResponse(list(books), safe=False)