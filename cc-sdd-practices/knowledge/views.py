from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.mixins import ListModelMixin

from .models import KnowledgeEntry, Tag
from .serializers import KnowledgeSerializer, TagSerializer


class KnowledgeViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeEntry.objects.all()
    serializer_class = KnowledgeSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ["title", "body"]
    filterset_fields = ["tags__name"]
    ordering = ["-updated_at"]


class TagViewSet(ListModelMixin, viewsets.GenericViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
