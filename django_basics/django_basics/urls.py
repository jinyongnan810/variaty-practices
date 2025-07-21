"""
URL configuration for django_basics project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from .views import (
    book_list,
    BookListCreateAPIView,
    BookRetrieveUpdateDestroyAPIView,
    redoc_view,
)
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Book API",
        default_version="v1",
        description="API documentation for Book model",
        contact=openapi.Contact(email="you@example.com"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/book-list", book_list, name="book-list"),
    path("api/books", BookListCreateAPIView.as_view(), name="book-list-create"),
    path(
        "api/books/<int:pk>",
        BookRetrieveUpdateDestroyAPIView.as_view(),
        name="book-detail",
    ),
    # Swagger and ReDoc
    path(
        "swagger",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    # path("redoc", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    path("redoc", redoc_view, name="custom-redoc"),
    path(
        "swagger.json", schema_view.without_ui(cache_timeout=0), name="schema-json"
    ),  # serves JSON
    path(
        "swagger.yaml", schema_view.without_ui(cache_timeout=0), name="schema-yaml"
    ),  # serves YAML
]
