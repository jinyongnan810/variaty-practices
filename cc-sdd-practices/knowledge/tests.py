from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.test import TestCase
from django.utils import timezone

from rest_framework import status
from rest_framework.test import APIClient

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


class KnowledgeViewSetTest(TestCase):
    """Test KnowledgeViewSet CRUD, search, and filtering."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.force_authenticate(user=self.user)

    def test_create_entry(self):
        data = {"title": "New Entry", "body": "Content", "tags": ["python"]}
        response = self.client.post("/api/knowledge/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Entry")

    def test_list_entries(self):
        KnowledgeEntry.objects.create(title="Entry 1", body="Body 1")
        KnowledgeEntry.objects.create(title="Entry 2", body="Body 2")
        response = self.client.get("/api/knowledge/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertEqual(len(response.data["results"]), 2)

    def test_retrieve_entry(self):
        entry = KnowledgeEntry.objects.create(title="Detail", body="Body")
        response = self.client.get(f"/api/knowledge/{entry.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Detail")

    def test_update_entry(self):
        entry = KnowledgeEntry.objects.create(title="Old", body="Old body")
        data = {"title": "Updated", "body": "New body"}
        response = self.client.put(f"/api/knowledge/{entry.id}/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated")

    def test_partial_update_entry(self):
        entry = KnowledgeEntry.objects.create(title="Original", body="Body")
        response = self.client.patch(
            f"/api/knowledge/{entry.id}/", {"title": "Patched"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Patched")
        self.assertEqual(response.data["body"], "Body")

    def test_delete_entry(self):
        entry = KnowledgeEntry.objects.create(title="ToDelete", body="Body")
        response = self.client.delete(f"/api/knowledge/{entry.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(KnowledgeEntry.objects.filter(id=entry.id).exists())

    def test_404_for_nonexistent_entry(self):
        response = self.client.get("/api/knowledge/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_by_title(self):
        KnowledgeEntry.objects.create(title="Django Guide", body="content")
        KnowledgeEntry.objects.create(title="Flask Guide", body="content")
        response = self.client.get("/api/knowledge/", {"search": "Django"})
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["title"], "Django Guide")

    def test_search_by_body(self):
        KnowledgeEntry.objects.create(title="Entry", body="Learn about Python basics")
        KnowledgeEntry.objects.create(title="Other", body="Learn about Rust basics")
        response = self.client.get("/api/knowledge/", {"search": "Python"})
        self.assertEqual(len(response.data["results"]), 1)

    def test_search_case_insensitive(self):
        KnowledgeEntry.objects.create(title="DJANGO Tips", body="content")
        response = self.client.get("/api/knowledge/", {"search": "django"})
        self.assertEqual(len(response.data["results"]), 1)

    def test_filter_by_tag_name(self):
        tag = Tag.objects.create(name="python")
        entry1 = KnowledgeEntry.objects.create(title="Tagged", body="body")
        entry1.tags.add(tag)
        KnowledgeEntry.objects.create(title="Untagged", body="body")
        response = self.client.get("/api/knowledge/", {"tags__name": "python"})
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["title"], "Tagged")

    def test_list_ordered_by_most_recently_updated(self):
        e1 = KnowledgeEntry.objects.create(title="First", body="body")
        e2 = KnowledgeEntry.objects.create(title="Second", body="body")
        # Update e1 so it becomes most recently updated
        e1.title = "First Updated"
        e1.save()
        response = self.client.get("/api/knowledge/")
        titles = [r["title"] for r in response.data["results"]]
        self.assertEqual(titles[0], "First Updated")
        self.assertEqual(titles[1], "Second")


class TagViewSetTest(TestCase):
    """Test TagViewSet read-only list."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.client.force_authenticate(user=self.user)

    def test_list_tags(self):
        Tag.objects.create(name="python")
        Tag.objects.create(name="django")
        response = self.client.get("/api/tags/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [t["name"] for t in response.data["results"]]
        self.assertIn("python", names)
        self.assertIn("django", names)

    def test_tag_list_is_read_only(self):
        response = self.client.post("/api/tags/", {"name": "new"}, format="json")
        self.assertIn(response.status_code, [
            status.HTTP_405_METHOD_NOT_ALLOWED,
            status.HTTP_403_FORBIDDEN,
        ])


class URLRoutingTest(TestCase):
    """Test URL routing is correctly wired."""

    def test_token_obtain_endpoint_exists(self):
        response = self.client.post(
            "/api/token/",
            {"username": "nonexistent", "password": "wrong"},
            content_type="application/json",
        )
        # Should return 401 (bad credentials), not 404 (endpoint missing)
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_token_refresh_endpoint_exists(self):
        response = self.client.post(
            "/api/token/refresh/",
            {"refresh": "invalid"},
            content_type="application/json",
        )
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_knowledge_endpoint_exists(self):
        response = self.client.get("/api/knowledge/")
        # 401 because unauthenticated, but not 404
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_tags_endpoint_exists(self):
        response = self.client.get("/api/tags/")
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)


# =============================================================================
# Integration Tests (Task 5)
# =============================================================================


class AuthenticatedAPITestCase(TestCase):
    """Base class providing JWT-authenticated API client."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="wikiuser", password="securepass123")
        # Obtain JWT token via the actual endpoint
        response = self.client.post(
            "/api/token/",
            {"username": "wikiuser", "password": "securepass123"},
            format="json",
        )
        self.access_token = response.data["access"]
        self.refresh_token = response.data["refresh"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")


class IntegrationCRUDTest(AuthenticatedAPITestCase):
    """5.1 - Test CRUD lifecycle and data validation."""

    def test_create_entry_returns_201_with_correct_structure(self):
        data = {"title": "My Note", "body": "# Hello\n\nWorld", "tags": ["python", "notes"]}
        response = self.client.post("/api/knowledge/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "My Note")
        self.assertEqual(response.data["body"], "# Hello\n\nWorld")
        self.assertEqual(len(response.data["tags"]), 2)
        self.assertIn("id", response.data)
        self.assertIn("created_at", response.data)
        self.assertIn("updated_at", response.data)
        # Tags should be nested objects
        tag_names = [t["name"] for t in response.data["tags"]]
        self.assertIn("python", tag_names)
        self.assertIn("notes", tag_names)

    def test_list_entries_returns_paginated_response(self):
        KnowledgeEntry.objects.create(title="E1", body="b1")
        KnowledgeEntry.objects.create(title="E2", body="b2")
        response = self.client.get("/api/knowledge/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)
        self.assertIn("results", response.data)
        self.assertEqual(response.data["count"], 2)

    def test_list_entries_ordered_by_most_recently_updated(self):
        e1 = KnowledgeEntry.objects.create(title="Older", body="body")
        KnowledgeEntry.objects.create(title="Newer", body="body")
        # Update e1 to make it most recent
        e1.title = "Oldest Now Newest"
        e1.save()
        response = self.client.get("/api/knowledge/")
        self.assertEqual(response.data["results"][0]["title"], "Oldest Now Newest")

    def test_retrieve_single_entry_with_full_data(self):
        tag = Tag.objects.create(name="django")
        entry = KnowledgeEntry.objects.create(
            title="Django Guide", body="# Django\n\n**Great** framework"
        )
        entry.tags.add(tag)
        response = self.client.get(f"/api/knowledge/{entry.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Django Guide")
        self.assertEqual(response.data["body"], "# Django\n\n**Great** framework")
        self.assertEqual(len(response.data["tags"]), 1)
        self.assertEqual(response.data["tags"][0]["name"], "django")
        self.assertIn("created_at", response.data)
        self.assertIn("updated_at", response.data)

    def test_full_update_via_put(self):
        entry = KnowledgeEntry.objects.create(title="Old", body="Old body")
        data = {"title": "New Title", "body": "New body", "tags": ["updated"]}
        response = self.client.put(f"/api/knowledge/{entry.id}/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "New Title")
        self.assertEqual(response.data["body"], "New body")

    def test_partial_update_via_patch(self):
        entry = KnowledgeEntry.objects.create(title="Original", body="Keep this")
        response = self.client.patch(
            f"/api/knowledge/{entry.id}/", {"title": "Changed"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Changed")
        self.assertEqual(response.data["body"], "Keep this")

    def test_delete_returns_204_and_removes_entry(self):
        entry = KnowledgeEntry.objects.create(title="Delete Me", body="bye")
        entry_id = entry.id
        response = self.client.delete(f"/api/knowledge/{entry_id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Verify entry is gone
        response = self.client.get(f"/api/knowledge/{entry_id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_nonexistent_entry_returns_404(self):
        response = self.client.get("/api/knowledge/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_missing_title_returns_400_with_field_errors(self):
        response = self.client.post(
            "/api/knowledge/", {"body": "content"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_missing_body_returns_400_with_field_errors(self):
        response = self.client.post(
            "/api/knowledge/", {"title": "No body"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("body", response.data)

    def test_empty_post_returns_400_with_field_errors(self):
        response = self.client.post("/api/knowledge/", {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertIn("body", response.data)

    def test_markdown_stored_and_returned_as_raw_text(self):
        markdown = "# Heading\n\n- item 1\n- item 2\n\n```python\nprint('hello')\n```\n\n> blockquote"
        data = {"title": "MD Test", "body": markdown}
        create_resp = self.client.post("/api/knowledge/", data, format="json")
        self.assertEqual(create_resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_resp.data["body"], markdown)
        # Retrieve and verify raw Markdown is preserved
        get_resp = self.client.get(f"/api/knowledge/{create_resp.data['id']}/")
        self.assertEqual(get_resp.data["body"], markdown)

    def test_response_format_is_json(self):
        KnowledgeEntry.objects.create(title="Test", body="body")
        response = self.client.get("/api/knowledge/")
        self.assertEqual(response["Content-Type"], "application/json")


class IntegrationAuthTest(TestCase):
    """5.2 - Test authentication enforcement."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="authuser", password="authpass123")

    def test_knowledge_endpoint_without_auth_returns_401(self):
        response = self.client.get("/api/knowledge/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_tags_endpoint_without_auth_returns_401(self):
        response = self.client.get("/api/tags/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_bearer_token_returns_401(self):
        self.client.credentials(HTTP_AUTHORIZATION="Bearer invalidtoken123")
        response = self.client.get("/api/knowledge/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_malformed_auth_header_returns_401(self):
        self.client.credentials(HTTP_AUTHORIZATION="NotBearer sometoken")
        response = self.client.get("/api/knowledge/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_obtain_returns_access_and_refresh(self):
        response = self.client.post(
            "/api/token/",
            {"username": "authuser", "password": "authpass123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_token_obtain_with_invalid_credentials_returns_401(self):
        response = self.client.post(
            "/api/token/",
            {"username": "authuser", "password": "wrongpassword"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_obtain_does_not_require_auth(self):
        # No credentials set — endpoint should still be reachable (not 401 from JWT middleware)
        response = self.client.post(
            "/api/token/",
            {"username": "authuser", "password": "authpass123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_refresh_does_not_require_auth(self):
        # Obtain tokens first
        token_resp = self.client.post(
            "/api/token/",
            {"username": "authuser", "password": "authpass123"},
            format="json",
        )
        refresh = token_resp.data["refresh"]
        # Refresh without auth header
        response = self.client.post(
            "/api/token/refresh/", {"refresh": refresh}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_authenticated_request_succeeds(self):
        # Obtain token
        token_resp = self.client.post(
            "/api/token/",
            {"username": "authuser", "password": "authpass123"},
            format="json",
        )
        access = token_resp.data["access"]
        # Use token for authenticated request
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        KnowledgeEntry.objects.create(title="Auth Test", body="body")
        response = self.client.get("/api/knowledge/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)


class IntegrationTagSearchFilterTest(AuthenticatedAPITestCase):
    """5.3 - Test tag management, search, and filtering."""

    def test_tags_auto_created_with_entry(self):
        data = {"title": "Entry", "body": "Body", "tags": ["newtag1", "newtag2"]}
        self.client.post("/api/knowledge/", data, format="json")
        self.assertTrue(Tag.objects.filter(name="newtag1").exists())
        self.assertTrue(Tag.objects.filter(name="newtag2").exists())

    def test_multiple_tags_on_single_entry(self):
        data = {"title": "Multi", "body": "Body", "tags": ["a", "b", "c"]}
        response = self.client.post("/api/knowledge/", data, format="json")
        self.assertEqual(len(response.data["tags"]), 3)

    def test_single_tag_across_multiple_entries(self):
        self.client.post(
            "/api/knowledge/",
            {"title": "E1", "body": "B1", "tags": ["shared"]},
            format="json",
        )
        self.client.post(
            "/api/knowledge/",
            {"title": "E2", "body": "B2", "tags": ["shared"]},
            format="json",
        )
        # Only one Tag object should exist
        self.assertEqual(Tag.objects.filter(name="shared").count(), 1)
        # Both entries should have it
        tag = Tag.objects.get(name="shared")
        self.assertEqual(tag.knowledgeentry_set.count(), 2)

    def test_tag_list_endpoint_returns_all_tags(self):
        Tag.objects.create(name="alpha")
        Tag.objects.create(name="beta")
        Tag.objects.create(name="gamma")
        response = self.client.get("/api/tags/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [t["name"] for t in response.data["results"]]
        self.assertEqual(sorted(names), ["alpha", "beta", "gamma"])

    def test_search_matches_title(self):
        KnowledgeEntry.objects.create(title="Django REST Framework", body="content")
        KnowledgeEntry.objects.create(title="Flask Tutorial", body="content")
        response = self.client.get("/api/knowledge/", {"search": "Django"})
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["title"], "Django REST Framework")

    def test_search_matches_body(self):
        KnowledgeEntry.objects.create(title="Entry", body="Python is awesome for scripting")
        KnowledgeEntry.objects.create(title="Other", body="Java is verbose")
        response = self.client.get("/api/knowledge/", {"search": "Python"})
        self.assertEqual(response.data["count"], 1)

    def test_search_is_case_insensitive(self):
        KnowledgeEntry.objects.create(title="UPPERCASE TITLE", body="content")
        response = self.client.get("/api/knowledge/", {"search": "uppercase"})
        self.assertEqual(response.data["count"], 1)

    def test_search_no_match_returns_empty_200(self):
        KnowledgeEntry.objects.create(title="Something", body="content")
        response = self.client.get("/api/knowledge/", {"search": "nonexistent"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)
        self.assertEqual(response.data["results"], [])

    def test_combined_search_and_tag_filter(self):
        tag_py = Tag.objects.create(name="python")
        tag_js = Tag.objects.create(name="javascript")
        e1 = KnowledgeEntry.objects.create(title="Python Basics", body="Learn Python")
        e1.tags.add(tag_py)
        e2 = KnowledgeEntry.objects.create(title="JS Basics", body="Learn JavaScript")
        e2.tags.add(tag_js)
        e3 = KnowledgeEntry.objects.create(title="Python Advanced", body="Advanced Python")
        e3.tags.add(tag_py)
        # Search for "Python" + filter by tag "python" — should get e1 and e3
        response = self.client.get(
            "/api/knowledge/", {"search": "Python", "tags__name": "python"}
        )
        self.assertEqual(response.data["count"], 2)
        titles = sorted([r["title"] for r in response.data["results"]])
        self.assertEqual(titles, ["Python Advanced", "Python Basics"])
