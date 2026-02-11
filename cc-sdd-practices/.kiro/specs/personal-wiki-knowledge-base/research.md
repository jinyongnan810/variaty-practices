# Research & Design Decisions

## Summary
- **Feature**: `personal-wiki-knowledge-base`
- **Discovery Scope**: New Feature (greenfield Django REST API)
- **Key Findings**:
  - `djangorestframework-simplejwt` is the recommended library for bearer token auth with DRF; uses `Bearer` header type by default
  - DRF's built-in `SearchFilter` provides case-insensitive keyword search across multiple fields out of the box
  - Django's `ManyToManyField` is the natural choice for knowledge-to-tag relationships; `django-filter` enables tag-based filtering on API endpoints

## Research Log

### Bearer Token Authentication Approach
- **Context**: Requirements specify bearer token authentication for all API endpoints
- **Sources Consulted**:
  - [DRF Authentication docs](https://www.django-rest-framework.org/api-guide/authentication/)
  - [djangorestframework-simplejwt docs](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html)
  - [djangorestframework-simplejwt GitHub](https://github.com/jazzband/djangorestframework-simplejwt)
- **Findings**:
  - DRF built-in `TokenAuthentication` uses `Token` keyword by default; requires subclassing for `Bearer`
  - `djangorestframework-simplejwt` uses `Bearer` by default, provides access/refresh token pair, configurable lifetimes
  - Default settings: ACCESS_TOKEN_LIFETIME=5min, REFRESH_TOKEN_LIFETIME=1day, ALGORITHM=HS256
  - No database token storage needed (stateless JWT); reduces DB queries per request
- **Implications**: Use `djangorestframework-simplejwt` — native `Bearer` header support, stateless, well-maintained (Jazzband)

### Keyword Search Implementation
- **Context**: Requirements specify case-insensitive keyword search across title and body fields
- **Sources Consulted**:
  - [DRF Filtering docs](https://www.django-rest-framework.org/api-guide/filtering/)
  - [DRF SearchFilter usage](https://medium.com/swlh/searching-in-django-rest-framework-45aad62e7782)
- **Findings**:
  - DRF `SearchFilter` provides case-insensitive partial matching by default via `icontains`
  - Supports multiple search terms (whitespace/comma separated); all terms must match
  - `search_fields` attribute on the view controls which model fields are searched
  - For SQLite (dev), `icontains` is sufficient; PostgreSQL enables full-text search with `@` prefix
- **Implications**: Use DRF's built-in `SearchFilter` for keyword search; combine with `django-filter` for tag filtering

### Tag Filtering Integration
- **Context**: Requirements specify filtering knowledge entries by tags alongside keyword search
- **Sources Consulted**:
  - [DRF Filtering docs](https://www.django-rest-framework.org/api-guide/filtering/)
  - [django-filter documentation](https://django-filter.readthedocs.io/)
- **Findings**:
  - `django-filter` integrates with DRF via `DjangoFilterBackend`
  - Supports filtering on related fields (e.g., `tags__name`)
  - Can be combined with `SearchFilter` and `OrderingFilter` on the same viewset
- **Implications**: Add `django-filter` as a dependency for tag-based filtering on knowledge list endpoints

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Single Django app | One `knowledge` app containing models, serializers, views, urls | Simple, minimal overhead, fits project scope | Could grow unwieldy with many features | Best fit for a personal wiki MVP |
| Separate apps per domain | `knowledge` app + `tags` app + `accounts` app | Clean domain separation | Over-engineered for single-user personal wiki | Consider if project grows significantly |

**Selected**: Single Django app (`knowledge`) — aligns with project simplicity and single-user scope.

## Design Decisions

### Decision: JWT over DRF Built-in TokenAuthentication
- **Context**: Need bearer token authentication per requirement 3
- **Alternatives Considered**:
  1. DRF `TokenAuthentication` with `keyword='Bearer'` subclass — simple, DB-backed tokens
  2. `djangorestframework-simplejwt` — stateless JWT with native Bearer support
- **Selected Approach**: `djangorestframework-simplejwt` with access/refresh token pair
- **Rationale**: Native `Bearer` header support, no per-request DB lookup, configurable token lifetimes, well-maintained by Jazzband
- **Trade-offs**: Tokens cannot be individually revoked server-side without additional infrastructure (acceptable for single-user wiki)
- **Follow-up**: Configure appropriate token lifetimes for personal use (longer access token acceptable)

### Decision: Single `knowledge` Django App
- **Context**: Need to organize models, views, serializers for knowledge entries, tags, and search
- **Alternatives Considered**:
  1. Single app containing all wiki functionality
  2. Multiple apps (`knowledge`, `tags`, `auth`)
- **Selected Approach**: Single `knowledge` app at the project root
- **Rationale**: Personal wiki is a small-scope project; splitting into multiple apps adds unnecessary complexity
- **Trade-offs**: All domain logic in one app; acceptable given single-user scope

### Decision: DRF SearchFilter + django-filter
- **Context**: Need keyword search across title/body and tag-based filtering
- **Alternatives Considered**:
  1. DRF `SearchFilter` + `django-filter` `DjangoFilterBackend`
  2. Custom search view with raw Django Q objects
  3. Full-text search engine (Elasticsearch, Meilisearch)
- **Selected Approach**: DRF `SearchFilter` + `django-filter`
- **Rationale**: Built-in DRF integration, minimal configuration, `icontains` is sufficient for personal wiki scale
- **Trade-offs**: No relevance ranking with SQLite; acceptable for personal use

## Risks & Mitigations
- **SQLite concurrency**: Single-user app, no concurrent write contention expected — mitigated by use case
- **JWT token revocation**: Cannot revoke individual tokens without blacklist — acceptable for single-user; `simplejwt` offers optional blacklist app if needed later
- **Search performance on large datasets**: `icontains` scans full text — mitigated by personal wiki scale; can add DB indexes or migrate to PostgreSQL full-text search if needed

## References
- [DRF Authentication](https://www.django-rest-framework.org/api-guide/authentication/) — TokenAuthentication and third-party auth schemes
- [djangorestframework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/) — JWT auth plugin for DRF
- [DRF Filtering](https://www.django-rest-framework.org/api-guide/filtering/) — SearchFilter, DjangoFilterBackend, OrderingFilter
- [django-filter](https://django-filter.readthedocs.io/) — Reusable filtering for Django querysets
