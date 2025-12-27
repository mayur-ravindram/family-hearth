# System Patterns & Architecture

## Architecture Pattern
**Framework:** Spring Boot (Java)
**Style:** Layered Architecture (Controller -> Service -> Repository) within a Modular Monolith.
**Modules:** The application appears to be structured by domain features (e.g., `com.familyhearth.posts`, `com.familyhearth.media`, `com.familyhearth.user`) rather than technical layers (e.g., `com.familyhearth.services`).

## Data Flow (Backend)
1.  **Request:** API receives a request (likely REST).
2.  **Security:** User context is extracted from `SecurityContextHolder` (Spring Security) via `CustomUserDetails`.
3.  **Service Layer:**
    *   Accepts DTOs (e.g., `CreatePostRequest`, `UpdateUserRequest`).
    *   Performs business logic, validation, and orchestration.
    *   Interacts with multiple Repositories (`PostRepository`, `MediaRepository`, `UserRepository`).
    *   Uses Mappers (`PostMapper`, `UserMapper`) to convert Entities to DTOs.
4.  **Persistence:** Spring Data JPA Repositories interact with the underlying Relational Database.
5.  **Response:** Service returns DTOs (e.g., `PaginatedPostsResponse`, `UserDto`) to the controller.

## Component Patterns (Frontend)
*Status: To Be Determined (Context provided was Backend API only).*

## State Management (Frontend)
*Status: To Be Determined (Context provided was Backend API only).*

## API Strategy
*   **Style:** RESTful (implied by Service structure).
*   **Pagination:** Cursor-based pagination is used for feeds.
    *   **Cursor Format:** Base64 encoded string of `Timestamp_ID` (e.g., `OffsetDateTime_Long`).
    *   **Implementation:** The Service manually decodes/encodes the cursor and delegates to a specific repository method (`findByFamilyIdWithCursor`).
*   **Data Transfer:** Strict usage of DTOs (`Request` and `Response` objects) to decouple the API contract from Database Entities.
*   **Partial Updates:** `PATCH` method is used for partial updates (e.g., `PATCH /users/me` for updating avatar).

## Naming & Style Conventions
*   **Language:** Java
*   **Classes:** PascalCase (e.g., `PostService`, `CreatePostRequest`).
*   **Variables/Methods:** camelCase (e.g., `createPost`, `postRepository`).
*   **Package Structure:** Lowercase, Domain-driven (e.g., `com.familyhearth.posts.service`).
*   **Constants/Enums:** implied standard Java conventions (though none explicitly visible in snippet, `request.getType()` implies an Enum or constant).

## Error Handling
*   **Exceptions:** Custom runtime exceptions are used for business logic failures.
    *   `MediaNotFoundException`
    *   `MediaOwnershipException`

## Media Handling
*   **Upload Flow:**
    1.  Client requests a signed URL (or upload path) via `POST /media/signed-url`.
    2.  Client uploads file directly to the storage location via `PUT /media/upload/{mediaId}`.
    3.  Client confirms the upload via `POST /media/confirm` (for posts) or implicitly via other actions (e.g., updating user profile).
*   **Storage:** Files are stored in a configured directory (local filesystem in dev).
*   **Serving:** Files are served via `GET /media/files/{filename}`.

## Technical Debt / Inconsistencies

### Dependency Injection
*   **Current Pattern:** Field Injection using `@Autowired`.
    ```java
    @Autowired
    private PostRepository postRepository;
    ```
*   **Recommended Standard:** Constructor Injection. This improves testability (easier mocking without reflection) and ensures immutability of dependencies.

### Cursor Logic
*   **Current Pattern:** Manual Base64 encoding/decoding and string splitting happens directly inside the `PostService`.
*   **Recommendation:** Extract this logic into a shared `CursorUtil` or `PaginationService` to avoid code duplication across different services that require pagination.

### JSON Handling
*   **Current Pattern:** `post.setContentJson(request.getContent())` implies raw Map/JSON handling for post content.
*   **Observation:** While flexible, this lacks schema enforcement at the Java level compared to a structured POJO for content.

### Transaction Management
*   **Current Pattern:** `@Transactional` is applied at the method level (`createPost`).
*   **Observation:** `getPosts` is not explicitly marked `@Transactional(readOnly = true)`, which is a common optimization pattern in Spring Data to avoid dirty checking on read operations.
