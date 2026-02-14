from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.mixins import ListModelMixin

from .models import KnowledgeEntry, Tag
from .serializers import KnowledgeSerializer, TagSerializer


class KnowledgeViewSet(viewsets.ModelViewSet):
    """Full CRUD viewset for knowledge entries with search and filtering."""

    queryset = KnowledgeEntry.objects.all()
    serializer_class = KnowledgeSerializer

    # SearchFilter: enables ?search= keyword lookup across title and body
    # DjangoFilterBackend: enables exact-match filtering via query params (e.g. ?tags__name=django)
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ["title", "body"]
    filterset_fields = ["tags__name"]
    ordering = ["-updated_at"]


# ListModelMixin: provides the .list() action for GET requests returning a collection
# GenericViewSet: base viewset with no actions; compose with mixins to pick only what you need
# Combined, they expose only GET /tags/ (list) — no create, update, delete, or retrieve
class TagViewSet(ListModelMixin, viewsets.GenericViewSet):
    """Read-only viewset that exposes a list endpoint for tags."""

    queryset = Tag.objects.all()
    serializer_class = TagSerializer
