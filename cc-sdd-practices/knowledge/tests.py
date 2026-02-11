from django.conf import settings
from django.db import models
from django.test import TestCase
from django.utils import timezone

from knowledge.models import KnowledgeEntry, Tag
from knowledge.serializers import KnowledgeSerializer, TagSerializer


class DjangoSettingsConfigurationTest(TestCase):
    """Test that Django settings are properly configured for the wiki API."""

    def test_knowledge_app_in_installed_apps(self):
        self.assertIn("knowledge", settings.INSTALLED_APPS)

    def test_rest_framework_in_installed_apps(self):
        self.assertIn("rest_framework", settings.INSTALLED_APPS)

    def test_django_filters_in_installed_apps(self):
        self.assertIn("django_filters", settings.INSTALLED_APPS)

    def test_drf_default_authentication_is_jwt(self):
        drf_settings = settings.REST_FRAMEWORK
        auth_classes = drf_settings.get("DEFAULT_AUTHENTICATION_CLASSES", [])
        self.assertIn(
            "rest_framework_simplejwt.authentication.JWTAuthentication",
            auth_classes,
        )

    def test_drf_default_renderer_is_json(self):
        drf_settings = settings.REST_FRAMEWORK
        renderers = drf_settings.get("DEFAULT_RENDERER_CLASSES", [])
        self.assertIn(
            "rest_framework.renderers.JSONRenderer",
            renderers,
        )

    def test_drf_pagination_configured(self):
        drf_settings = settings.REST_FRAMEWORK
        self.assertEqual(
            drf_settings.get("DEFAULT_PAGINATION_CLASS"),
            "rest_framework.pagination.PageNumberPagination",
        )
        self.assertIsInstance(drf_settings.get("PAGE_SIZE"), int)
        self.assertGreater(drf_settings.get("PAGE_SIZE"), 0)


class TagModelTest(TestCase):
    """Test the Tag data model."""

    def test_create_tag(self):
        tag = Tag.objects.create(name="python")
        self.assertEqual(tag.name, "python")
        self.assertIsNotNone(tag.id)

    def test_tag_name_is_unique(self):
        Tag.objects.create(name="django")
        with self.assertRaises(Exception):
            Tag.objects.create(name="django")

    def test_tag_name_max_length(self):
        field = Tag._meta.get_field("name")
        self.assertEqual(field.max_length, 100)

    def test_tag_has_created_at_auto(self):
        tag = Tag.objects.create(name="test")
        self.assertIsNotNone(tag.created_at)
        self.assertAlmostEqual(
            tag.created_at, timezone.now(), delta=timezone.timedelta(seconds=5)
        )

    def test_tag_str(self):
        tag = Tag.objects.create(name="python")
        self.assertEqual(str(tag), "python")


class KnowledgeEntryModelTest(TestCase):
    """Test the KnowledgeEntry data model."""

    def test_create_entry(self):
        entry = KnowledgeEntry.objects.create(
            title="Test Entry",
            body="# Hello\n\nThis is **markdown** content.",
        )
        self.assertEqual(entry.title, "Test Entry")
        self.assertEqual(entry.body, "# Hello\n\nThis is **markdown** content.")
        self.assertIsNotNone(entry.id)

    def test_title_max_length(self):
        field = KnowledgeEntry._meta.get_field("title")
        self.assertEqual(field.max_length, 255)

    def test_body_is_textfield_no_max_length(self):
        field = KnowledgeEntry._meta.get_field("body")
        self.assertIsInstance(field, models.TextField)
        self.assertIsNone(field.max_length)

    def test_body_stores_raw_markdown(self):
        markdown = "# Heading\n\n- item 1\n- item 2\n\n```python\nprint('hello')\n```"
        entry = KnowledgeEntry.objects.create(title="Markdown Test", body=markdown)
        entry.refresh_from_db()
        self.assertEqual(entry.body, markdown)

    def test_created_at_auto_set(self):
        entry = KnowledgeEntry.objects.create(title="Test", body="content")
        self.assertIsNotNone(entry.created_at)
        self.assertAlmostEqual(
            entry.created_at, timezone.now(), delta=timezone.timedelta(seconds=5)
        )

    def test_updated_at_auto_set(self):
        entry = KnowledgeEntry.objects.create(title="Test", body="content")
        self.assertIsNotNone(entry.updated_at)

    def test_updated_at_changes_on_save(self):
        entry = KnowledgeEntry.objects.create(title="Test", body="content")
        original_updated = entry.updated_at
        entry.title = "Updated Title"
        entry.save()
        entry.refresh_from_db()
        self.assertGreaterEqual(entry.updated_at, original_updated)

    def test_default_ordering_is_most_recently_updated(self):
        ordering = KnowledgeEntry._meta.ordering
        self.assertEqual(ordering, ["-updated_at"])

    def test_many_to_many_tags(self):
        tag1 = Tag.objects.create(name="python")
        tag2 = Tag.objects.create(name="django")
        entry = KnowledgeEntry.objects.create(title="Test", body="content")
        entry.tags.add(tag1, tag2)
        self.assertEqual(entry.tags.count(), 2)
        self.assertIn(tag1, entry.tags.all())
        self.assertIn(tag2, entry.tags.all())

    def test_entry_can_have_zero_tags(self):
        entry = KnowledgeEntry.objects.create(title="Test", body="content")
        self.assertEqual(entry.tags.count(), 0)

    def test_tag_shared_across_entries(self):
        tag = Tag.objects.create(name="shared")
        entry1 = KnowledgeEntry.objects.create(title="Entry 1", body="body 1")
        entry2 = KnowledgeEntry.objects.create(title="Entry 2", body="body 2")
        entry1.tags.add(tag)
        entry2.tags.add(tag)
        self.assertEqual(tag.knowledgeentry_set.count(), 2)

    def test_str(self):
        entry = KnowledgeEntry.objects.create(title="My Entry", body="content")
        self.assertEqual(str(entry), "My Entry")


class TagSerializerTest(TestCase):
    """Test TagSerializer output format."""

    def test_serializes_tag_fields(self):
        tag = Tag.objects.create(name="python")
        serializer = TagSerializer(tag)
        data = serializer.data
        self.assertEqual(set(data.keys()), {"id", "name", "created_at"})
        self.assertEqual(data["name"], "python")
        self.assertEqual(data["id"], tag.id)
        self.assertIsNotNone(data["created_at"])


class KnowledgeSerializerTest(TestCase):
    """Test KnowledgeSerializer validation, tag handling, and output."""

    def test_serialize_entry_includes_all_fields(self):
        tag = Tag.objects.create(name="django")
        entry = KnowledgeEntry.objects.create(title="Test", body="content")
        entry.tags.add(tag)
        serializer = KnowledgeSerializer(entry)
        data = serializer.data
        self.assertIn("id", data)
        self.assertIn("title", data)
        self.assertIn("body", data)
        self.assertIn("tags", data)
        self.assertIn("created_at", data)
        self.assertIn("updated_at", data)

    def test_read_returns_nested_tag_objects(self):
        tag = Tag.objects.create(name="python")
        entry = KnowledgeEntry.objects.create(title="Test", body="content")
        entry.tags.add(tag)
        serializer = KnowledgeSerializer(entry)
        tags_data = serializer.data["tags"]
        self.assertEqual(len(tags_data), 1)
        self.assertEqual(tags_data[0]["name"], "python")
        self.assertIn("id", tags_data[0])
        self.assertIn("created_at", tags_data[0])

    def test_write_accepts_tag_names_as_strings(self):
        data = {
            "title": "New Entry",
            "body": "Some content",
            "tags": ["python", "django"],
        }
        serializer = KnowledgeSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_create_with_new_tags(self):
        data = {
            "title": "New Entry",
            "body": "Content here",
            "tags": ["newtag1", "newtag2"],
        }
        serializer = KnowledgeSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        entry = serializer.save()
        self.assertEqual(entry.tags.count(), 2)
        self.assertTrue(Tag.objects.filter(name="newtag1").exists())
        self.assertTrue(Tag.objects.filter(name="newtag2").exists())

    def test_create_with_existing_tags(self):
        Tag.objects.create(name="existing")
        data = {
            "title": "Entry",
            "body": "Body",
            "tags": ["existing"],
        }
        serializer = KnowledgeSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        entry = serializer.save()
        self.assertEqual(entry.tags.count(), 1)
        self.assertEqual(Tag.objects.filter(name="existing").count(), 1)

    def test_create_without_tags(self):
        data = {"title": "No Tags", "body": "Body"}
        serializer = KnowledgeSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        entry = serializer.save()
        self.assertEqual(entry.tags.count(), 0)

    def test_update_replaces_tags(self):
        tag_old = Tag.objects.create(name="old")
        entry = KnowledgeEntry.objects.create(title="Entry", body="Body")
        entry.tags.add(tag_old)
        data = {"title": "Entry", "body": "Body", "tags": ["new"]}
        serializer = KnowledgeSerializer(entry, data=data)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        tag_names = list(updated.tags.values_list("name", flat=True))
        self.assertEqual(tag_names, ["new"])

    def test_title_is_required(self):
        data = {"body": "Content"}
        serializer = KnowledgeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)

    def test_body_is_required(self):
        data = {"title": "Title"}
        serializer = KnowledgeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("body", serializer.errors)

    def test_body_returns_raw_markdown(self):
        markdown = "# Title\n\n**bold** and *italic*\n\n```code```"
        entry = KnowledgeEntry.objects.create(title="MD", body=markdown)
        serializer = KnowledgeSerializer(entry)
        self.assertEqual(serializer.data["body"], markdown)

    def test_timestamps_in_output(self):
        entry = KnowledgeEntry.objects.create(title="Test", body="content")
        serializer = KnowledgeSerializer(entry)
        self.assertIsNotNone(serializer.data["created_at"])
        self.assertIsNotNone(serializer.data["updated_at"])
