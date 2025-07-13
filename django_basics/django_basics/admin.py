from django.contrib import admin
from .models import Book

class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author')
    search_fields = ('title',)
    
admin.site.register(Book, BookAdmin)