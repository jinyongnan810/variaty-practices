from django.conf import settings
from django.db import models
from django.test import TestCase
from django.utils import timezone

from knowledge.models import KnowledgeEntry, Tag


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
