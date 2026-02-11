# Implementation Plan

- [x] 1. Install dependencies, create the knowledge app, and configure Django settings
  - Add djangorestframework-simplejwt and django-filter as project dependencies via Poetry
  - Create the knowledge Django app as a top-level directory alongside config
  - Register the knowledge app, rest_framework, and django_filters in INSTALLED_APPS
  - Set the DRF default authentication class to JWT bearer token authentication globally
  - Set the DRF default renderer to JSON and configure page-number pagination with a default page size
  - _Requirements: 3.1, 3.2, 3.3, 6.1, 6.3_

- [ ] 2. Define KnowledgeEntry and Tag data models with migrations
  - Create the KnowledgeEntry model with a title field, a body text field for raw Markdown content with no maximum length restriction, and auto-managed created_at and updated_at timestamps
  - Create the Tag model with a unique name field and a created_at timestamp
  - Establish a many-to-many relationship from KnowledgeEntry to Tag allowing entries to have zero or more tags
  - Set default model ordering to most recently updated first
  - Generate and apply database migrations
  - _Requirements: 1.7, 2.1, 2.3, 4.4, 4.5, 6.2_

- [ ] 3. Build serializers with tag handling logic
  - Create a TagSerializer that outputs tag id, name, and created_at fields
  - Create a KnowledgeSerializer that accepts a list of tag name strings on write operations and returns nested tag objects on read operations
  - Implement get-or-create logic for tags in the serializer's create and update methods so that new tag names are automatically created when first used
  - Ensure the serializer enforces that title and body are required fields and returns field-level validation errors for invalid input
  - Include created_at and updated_at timestamps in the serialized knowledge entry output
  - _Requirements: 1.1, 2.1, 2.2, 4.1, 4.2, 4.6, 6.2, 6.4_

- [ ] 4. API endpoints and URL routing
- [ ] 4.1 Create KnowledgeViewSet with CRUD, search, and filtering
  - Implement a model viewset that provides list, create, retrieve, update, partial update, and delete actions for knowledge entries
  - Configure keyword search across title and body fields using DRF SearchFilter with case-insensitive matching
  - Enable tag-based filtering on the list endpoint using DjangoFilterBackend so entries can be filtered by tag name
  - Set default result ordering to most recently updated first
  - Ensure requests for non-existent entries return a 404 response
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 4.2 Create TagViewSet and wire all URL routing
  - Implement a read-only viewset that lists all existing tags
  - Register both the knowledge and tag viewsets with a DRF router under the /api/ prefix
  - Add JWT token obtain and token refresh endpoints under /api/token/ without requiring authentication
  - Include the knowledge app URLs in the project root URL configuration
  - _Requirements: 3.4, 3.5, 4.3_

- [ ] 5. Integration tests
- [ ] 5.1 (P) Test CRUD lifecycle and data validation
  - Verify creating a knowledge entry with title, body, and tags returns 201 with the correct response structure including nested tags and timestamps
  - Verify listing entries returns a paginated response ordered by most recently updated
  - Verify retrieving a single entry returns the full entry with raw Markdown body, tags, and timestamps
  - Verify full and partial updates modify the entry and return the updated resource
  - Verify deleting an entry returns 204 and the entry is no longer retrievable
  - Verify requesting a non-existent entry returns 404
  - Verify submitting invalid or missing required fields returns 400 with field-level error details
  - Verify Markdown content is stored and returned as raw text without any transformation
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 6.1, 6.2, 6.3, 6.4_

- [ ] 5.2 (P) Test authentication enforcement
  - Verify requests to knowledge and tag endpoints without an Authorization header return 401
  - Verify requests with an invalid or malformed bearer token return 401
  - Verify obtaining a token with valid credentials returns access and refresh tokens
  - Verify the token obtain and refresh endpoints do not require authentication
  - Verify authenticated requests with a valid bearer token succeed and return expected data
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 5.3 (P) Test tag management, search, and filtering
  - Verify tags are automatically created when new tag names are submitted with an entry
  - Verify multiple tags can be associated with a single entry and a single tag can appear on multiple entries
  - Verify the tag list endpoint returns all existing tags
  - Verify keyword search returns matching entries across title and body fields with case-insensitive matching
  - Verify a search query that matches nothing returns 200 with an empty results list
  - Verify combining a search query with a tag filter returns only entries matching both criteria
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5_
