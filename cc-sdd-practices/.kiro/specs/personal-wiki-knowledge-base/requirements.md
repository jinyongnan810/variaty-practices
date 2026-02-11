# Requirements Document

## Introduction
wikinn is a personal wiki application that allows a single user to create, organize, and retrieve knowledge entries written in Markdown. The system exposes a RESTful API authenticated via bearer tokens, supports tagging knowledge entries for categorization, and provides keyword-based search functionality.

## Requirements

### Requirement 1: Knowledge Entry CRUD
**Objective:** As a user, I want to create, read, update, and delete knowledge entries, so that I can manage my personal wiki content.

#### Acceptance Criteria
1. When a valid POST request with title and markdown body is sent to the knowledge endpoint, the Wiki API shall create a new knowledge entry and return the created resource with a 201 status code.
2. When a GET request is sent to the knowledge list endpoint, the Wiki API shall return a paginated list of knowledge entries ordered by most recently updated.
3. When a GET request is sent to a specific knowledge entry endpoint, the Wiki API shall return the full entry including title, markdown body, tags, and timestamps.
4. When a valid PUT/PATCH request is sent to a specific knowledge entry endpoint, the Wiki API shall update the entry and return the updated resource.
5. When a DELETE request is sent to a specific knowledge entry endpoint, the Wiki API shall delete the entry and return a 204 status code.
6. If a request references a knowledge entry that does not exist, the Wiki API shall return a 404 status code with an appropriate error message.
7. The Wiki API shall store knowledge entry body content as raw Markdown without server-side rendering.

### Requirement 2: Markdown Content Support
**Objective:** As a user, I want my knowledge entries to support Markdown formatting, so that I can write richly structured content.

#### Acceptance Criteria
1. The Wiki API shall accept and store Markdown-formatted text in the knowledge entry body field.
2. When a knowledge entry is retrieved, the Wiki API shall return the raw Markdown content in the body field.
3. The Wiki API shall not impose a maximum length restriction on the Markdown body content (limited only by database field capacity).

### Requirement 3: Bearer Token Authentication
**Objective:** As a user, I want API access protected by bearer token authentication, so that only I can access my wiki content.

#### Acceptance Criteria
1. The Wiki API shall require a valid bearer token in the Authorization header for all knowledge, tag, and search endpoints.
2. If a request is made without an Authorization header, the Wiki API shall return a 401 status code.
3. If a request is made with an invalid or expired bearer token, the Wiki API shall return a 401 status code with an appropriate error message.
4. When valid credentials are submitted to the token endpoint, the Wiki API shall return a bearer token for subsequent API authentication.
5. The Wiki API shall not require authentication for the token obtain endpoint.

### Requirement 4: Tag Management
**Objective:** As a user, I want to attach tags to knowledge entries, so that I can categorize and organize my content.

#### Acceptance Criteria
1. When creating or updating a knowledge entry, the Wiki API shall accept a list of tag names to associate with the entry.
2. When a tag name does not already exist, the Wiki API shall automatically create it upon association with a knowledge entry.
3. When a GET request is sent to the tags endpoint, the Wiki API shall return a list of all existing tags.
4. The Wiki API shall support associating multiple tags with a single knowledge entry.
5. The Wiki API shall support associating a single tag with multiple knowledge entries.
6. When a knowledge entry is retrieved, the Wiki API shall include its associated tags in the response.

### Requirement 5: Keyword Search
**Objective:** As a user, I want to search knowledge entries by keywords, so that I can quickly find relevant information.

#### Acceptance Criteria
1. When a GET request with a search query parameter is sent to the search endpoint, the Wiki API shall return knowledge entries whose title or body contains the search keywords.
2. The Wiki API shall perform case-insensitive keyword matching for search queries.
3. When a search query matches no entries, the Wiki API shall return an empty list with a 200 status code.
4. The Wiki API shall return search results ordered by relevance or most recently updated.
5. When a GET request includes both a search query and tag filter parameters, the Wiki API shall return entries matching both criteria.

### Requirement 6: API Response Standards
**Objective:** As a user, I want consistent and predictable API responses, so that I can reliably integrate with the wiki.

#### Acceptance Criteria
1. The Wiki API shall return all responses in JSON format.
2. The Wiki API shall include `created_at` and `updated_at` timestamps on all knowledge entry responses.
3. The Wiki API shall support pagination for list endpoints with configurable page size.
4. If a request contains invalid or malformed data, the Wiki API shall return a 400 status code with field-level error details.
