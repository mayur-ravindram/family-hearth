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
- **Summary:** Accept an invite
- **Authentication:** Required.
- **Parameters:**
  - `code`: string (path)
- **Request Body:**
  ```json
  {
      "userId": "integer (format: int64)"
  }
  ```
- **Responses:**
  - `200 OK`: Invite accepted successfully.

---

### `POST /media/signed-url`
- **Summary:** Create a signed URL for media upload
- **Authentication:** Required.
- **Request Body:**
  ```json
  {
      "fileName": "string",
      "contentType": "string"
  }
  ```
- **Responses:**
  - `200 OK`: Signed URL created successfully.
    ```json
    {
        "url": "string",
        "mediaId": "integer (format: int64)"
    }
    ```

---

### `PUT /media/upload/{mediaId}`
- **Summary:** Upload a file
- **Authentication:** None required (authentication is handled by the pre-signed URL itself).
- **Parameters:**
  - `mediaId`: integer (path)
- **Request Body:** (raw binary data)
  - `application/octet-stream`: Binary content of the file.
- **Responses:**
  - `200 OK`: File uploaded successfully.

---

### `POST /media/confirm`
- **Summary:** Confirm media upload
- **Authentication:** Required.
- **Request Body:**
  ```json
  {
      "mediaId": "integer (format: int64)",
      "postId": "integer (format: int64)"
  }
  ```
- **Responses:**
  - `200 OK`: Media confirmed successfully.

---

### `GET /media/files/{filename}`
- **Summary:** Serve a media file
- **Authentication:** Publicly accessible. Access control is managed by the obscurity of the filename/URL.
- **Parameters:**
  - `filename`: string (path)
- **Responses:**
  - `200 OK`: A single media file.
    - `application/octet-stream`: Binary content of the file.

---

### `GET /posts`
- **Summary:** Retrieve a list of posts
- **Authentication:** Required.
- **Responses:**
  - `200 OK`: A paginated list of posts.
    ```json
    {
        "posts": [
            {
                "id": "integer (format: int64)",
                "authorId": "integer (format: int64)",
                "type": "string",
                "contentJson": "object (additionalProperties: true)",
                "media": [
                    {
                        "id": "integer (format: int64)",
                        "url": "string",
                        "type": "string"
                    }
                ],
                "createdAt": "string (format: date-time)"
            }
        ],
        "nextCursor": "string (nullable)"
    }
    ```

---

### `POST /posts`
- **Summary:** Create a new post
- **Authentication:** Required.
- **Request Body:**
  ```json
  {
      "type": "string",
      "contentJson": "object (additionalProperties: true)",
      "mediaIds": [
          "integer (format: int64)"
      ]
  }
  ```
- **Responses:**
  - `201 Created`: Post created successfully.
    ```json
    {
        "id": "integer (format: int64)",
        "authorId": "integer (format: int64)",
        "type": "string",
        "contentJson": "object (additionalProperties: true)",
        "media": [
            {
                "id": "integer (format: int64)",
                "url": "string",
                "type": "string"
            }
        ],
        "createdAt": "string (format: date-time)"
    }
    ```

---

### `POST /sync/batch`
- **Summary:** Perform a batch sync
- **Authentication:** Required.
- **Responses:**
  - `200 OK`: Batch sync performed successfully.

---

### `POST /time-capsules`
- **Summary:** Create a new time capsule
- **Authentication:** Required.
- **Request Body:**
  ```json
  {
      "title": "string",
      "description": "string",
      "openDate": "string (format: date-time)"
  }
  ```
- **Responses:**
  - `201 Created`: Time capsule created successfully.
    ```json
    {
        "id": "integer (format: int64)",
        "title": "string",
        "description": "string",
        "openDate": "string (format: date-time)"
    }
    ```

---

### `GET /users/me`
- **Summary:** Retrieve the current user's profile
- **Authentication:** Required.
- **Responses:**
  - `200 OK`: The current user's profile.
    ```json
    {
        "id": "integer (format: int64)",
        "firstName": "string",
        "lastName": "string",
        "email": "string (format: email)"
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
    "authorId": "integer (format: int64)",
    "type": "string",
    "contentJson": "object (additionalProperties: true)",
    "media": [
        "object (ref: MediaDto)"
    ],
    "createdAt": "string (format: date-time)"
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
    "email": "string (format: email)"
}
```