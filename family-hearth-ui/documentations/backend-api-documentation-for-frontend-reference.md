# FamilyHearth API Documentation

This document provides a comprehensive guide for frontend developers to consume the FamilyHearth API, based on the OpenAPI specification.

## General Information

### Base URL

All API endpoints are prefixed with the following base URL:

`http://localhost:8080/api/v1`

### Authentication

Most endpoints are protected and require an `accessToken` to be sent in the `Authorization` header.
The `accessToken` and `refreshToken` are obtained upon successful magic link verification or token refresh.

**Header Format:**
`Authorization: Bearer <YOUR_ACCESS_TOKEN>`

---

## Endpoints

### `POST /auth/magic-link`
- **Summary:** Send a magic link for authentication
- **Authentication:** None required.
- **Request Body:**
  ```json
  {
      "email": "string (format: email)"
  }
  ```
- **Responses:**
  - `200 OK`: Magic link sent successfully.

---

### `POST /auth/dev/login`
- **Summary:** Developer login (Bypass magic link)
- **Description:** Direct login for development and testing purposes. Skips email verification. **Do not use in production.**
- **Authentication:** None required.
- **Request Body:**
  ```json
  {
      "email": "string (format: email)"
  }
  ```
- **Responses:**
  - `200 OK`: Login successful.
    ```json
    {
        "accessToken": "string",
        "refreshToken": "string"
    }
    ```

---

### `POST /auth/verify`
- **Summary:** Verify a magic link token
- **Authentication:** None required.
- **Request Body:**
  ```json
  {
      "token": "string"
  }
  ```
- **Responses:**
  - `200 OK`: Token verified successfully.
    ```json
    {
        "accessToken": "string",
        "refreshToken": "string"
    }
    ```

---

### `POST /auth/refresh`
- **Summary:** Refresh an access token
- **Authentication:** Required (with refreshToken).
- **Request Body:**
  ```json
  {
      "refreshToken": "string"
  }
  ```
- **Responses:**
  - `200 OK`: Access token refreshed successfully.
    ```json
    {
        "accessToken": "string",
        "refreshToken": "string"
    }
    ```

---

### `POST /families`
- **Summary:** Create a new family
- **Authentication:** Required.
- **Request Body:**
  ```json
  {
      "name": "string",
      "timezone": "string",
      "adminName": "string",
      "adminEmail": "string",
      "phone": "string"
  }
  ```
- **Responses:**
  - `201 Created`: Family created successfully.
    ```json
    {
        "id": "integer (format: int64)",
        "name": "string"
    }
    ```

---

### `GET /families/{familyId}`
- **Summary:** Retrieve a family by ID
- **Authentication:** Required.
- **Parameters:**
  - `familyId`: integer (path)
- **Responses:**
  - `200 OK`: A single family.
    ```json
    {
        "id": "integer (format: int64)",
        "name": "string"
    }
    ```

---

### `POST /families/{familyId}/invites`
- **Summary:** Create an invite for a family
- **Authentication:** Required.
- **Parameters:**
  - `familyId`: integer (path)
- **Request Body:**
  ```json
  {
      "maxUses": "integer"
  }
  ```
- **Responses:**
  - `201 Created`: Invite created successfully.
    ```json
    {
        "code": "string",
        "familyId": "integer (format: int64)",
        "maxUses": "integer",
        "uses": "integer"
    }
    ```

---

### `POST /invites/{code}/accept`
- **Summary:** Accept an invite and create a new user
- **Description:** Accepts an invite to join a family. This endpoint is for new users and will create a user account for them.
- **Authentication:** None required.
- **Parameters:**
  - `code`: string (path)
- **Request Body:**
  ```json
  {
      "firstName": "string",
      "lastName": "string",
      "email": "string (format: email)",
      "phone": "string"
  }
  ```
- **Responses:**
  - `200 OK`: Invite accepted successfully and user created.
    ```json
    {
        "accessToken": "string",
        "refreshToken": "string"
    }
    ```

---

### `PATCH /users/me`
- **Summary:** Update the current user's profile
- **Authentication:** Required.
- **Request Body:**
  ```json
  {
      "avatarFileId": "integer (format: int64)"
  }
  ```
- **Responses:**
  - `200 OK`: The updated user profile.
    ```json
    {
        "id": "integer (format: int64)",
        "firstName": "string",
        "lastName": "string",
        "email": "string (format: email)",
        "avatarUrl": "string"
    }
    ```

---

## Schemas

### `MagicLinkRequest`
```json
{
    "email": "string (format: email)"
}
```

---

### `VerifyTokenRequest`
```json
{
    "token": "string"
}
```

---

### `VerifyTokenResponse`
```json
{
    "accessToken": "string",
    "refreshToken": "string"
}
```

---

### `RefreshTokenRequest`
```json
{
    "refreshToken": "string"
}
```

---

### `RefreshTokenResponse`
```json
{
    "accessToken": "string",
    "refreshToken": "string"
}
```

---

### `CreateFamilyRequest`
```json
{
    "name": "string"
}
```

---

### `CreateFamilyResponse`
```json
{
    "id": "integer (format: int64)",
    "name": "string"
}
```

---

### `Family`
```json
{
    "id": "integer (format: int64)",
    "name": "string"
}
```

---

### `InviteRequest`
```json
{
    "maxUses": "integer"
}
```

---

### `Invite`
```json
{
    "code": "string",
    "familyId": "integer (format: int64)",
    "maxUses": "integer",
    "uses": "integer"
}
```

---

### `AcceptInviteRequest`
```json
{
    "userId": "integer (format: int64)"
}
```

---

### `SignedUrlRequest`
```json
{
    "fileName": "string",
    "contentType": "string"
}
```

---

### `SignedUrlResponse`
```json
{
    "url": "string",
    "mediaId": "integer (format: int64)"
}
```

---

### `ConfirmMediaRequest`
```json
{
    "mediaId": "integer (format: int64)",
    "postId": "integer (format: int64)"
}
```

---

### `CreateTimeCapsuleRequest`
```json
{
    "title": "string",
    "description": "string",
    "openDate": "string (format: date-time)"
}
```

---

### `CreatePostRequest`
```json
{
    "type": "string",
    "contentJson": "object (additionalProperties: true)",
    "mediaIds": [
        "integer (format: int64)"
    ]
}
```

---

### `TimeCapsule`
```json
{
    "id": "integer (format: int64)",
    "title": "string",
    "description": "string",
    "openDate": "string (format: date-time)"
}
```

---

### `PaginatedPostsResponse`
```json
{
    "posts": [
        "object (ref: PostDto)"
    ],
    "nextCursor": "string (nullable)"
}
```

---

### `PostDto`
```json
{
    "id": "integer (format: int64)",
    "author": "object (ref: AuthorDto)",
    "type": "string",
    "contentJson": "object (additionalProperties: true)",
    "media": [
        "object (ref: MediaDto)"
    ],
    "createdAt": "string (format: date-time)"
}
```

---

### `AuthorDto`
```json
{
    "id": "integer (format: int64)",
    "firstName": "string",
    "lastName": "string",
    "avatarUrl": "string"
}
```

---

### `MediaDto`
```json
{
    "id": "integer (format: int64)",
    "url": "string",
    "type": "string"
}
```

---

### `UserDto`
```json
{
    "id": "integer (format: int64)",
    "firstName": "string",
    "lastName": "string",
    "email": "string (format: email)",
    "avatarUrl": "string"
}
```

---

### `UpdateUserRequest`
```json
{
    "avatarFileId": "integer (format: int64)"
}
```
