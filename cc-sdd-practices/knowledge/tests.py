from django.conf import settings
from django.test import TestCase


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
