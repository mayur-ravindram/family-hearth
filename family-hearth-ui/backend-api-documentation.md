# FamilyHearth API Documentation

This document provides a comprehensive guide for frontend developers to consume the FamilyHearth API.

## General Information

### Base URL

All API endpoints are prefixed with the following base URL:

`http://localhost:8080/api/v1`

### Authentication

- Most endpoints are protected and require a JSON Web Token (JWT) to be sent in the `Authorization` header.
- The token is obtained upon successful user creation or authentication.

**Header Format:**
`Authorization: Bearer <YOUR_JWT_TOKEN>`

---

## 1. Authentication

Handles user login via a passwordless "magic link" system.

### 1.1 Request a Magic Link

- **Endpoint:** `POST /auth/magic-link`
- **Description:** Initiates the login process for a user. In a real application, this would send an email. For testing, the token is printed to the application console and saved to the `magic_link_tokens` table.
- **Authentication:** None required.

**Request Body:**
```json
{
    "email": "linda@bobsburgers.com"
}
```

**Success Response:**
- **Code:** `200 OK`
- **Body:** Empty

---

### 1.2 Verify Magic Link Token

- **Endpoint:** `POST /auth/verify`
- **Description:** The user provides the single-use token from the magic link to get a session JWT.
- **Authentication:** None required.

**Request Body:**
```json
{
    "token": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

**Success Response:**
- **Code:** `200 OK`
- **Body:**
```json
{
    "jwt": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Error Responses:**
- **Code:** `404 Not Found`
- **Body:** `{ "error": "Invalid or expired magic link token." }`

---

## 2. Families & Invites

Handles the creation of families and the user invitation flow.

### 2.1 Create a New Family

- **Endpoint:** `POST /families`
- **Description:** Creates a new family and the first administrative user. This is the starting point for any new user group.
- **Authentication:** None required.

**Request Body:**
```json
{
    "name": "The Belcher Family",
    "timezone": "America/New_York",
    "adminName": "Bob Belcher",
    "adminEmail": "bob@bobsburgers.com",
    "phone": "555-1234"
}
```

**Success Response:**
- **Code:** `201-Created`
- **Body:**
```json
{
    "family": {
        "id": 1,
        "name": "The Belcher Family",
        "timezone": "America/New_York",
        "adminId": 1,
        "createdAt": "2024-05-25T10:00:00.000Z"
    },
    "jwt": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Error Responses:**
- **Code:** `409 Conflict`
- **Body:** `{ "error": "A user with email bob@bobsburgers.com already exists." }`

---

### 2.2 Create an Invite Code

- **Endpoint:** `POST /families/{familyId}/invites`
- **Description:** An admin generates a single-use invite code for a new member to join their family.
- **Authentication:** **Required (Admin Role)**.

**Request Body:**
```json
{
    "maxUses": 1
}
```

**Success Response:**
- **Code:** `201 Created`
- **Body:**
```json
{
    "code": "b4c5d6e7-f8a9-0123-4567-890abcdef123",
    "familyId": 1,
    "expiresAt": "2024-06-01T10:00:00.000Z",
    "createdBy": 1,
    "maxUses": 1
}
```

---

### 2.3 Accept an Invite

- **Endpoint:** `POST /invites/{code}/accept`
- **Description:** A new user joins a family by providing a valid invite code and their details.
- **Authentication:** None required.

**Request Body:**
```json
{
    "name": "Linda Belcher",
    "email": "linda@bobsburgers.com"
}
```

**Success Response:**
- **Code:** `200 OK`
- **Body:** Empty

**Error Responses:**
- **Code:** `419` (Custom) - **Body:** `{ "error": "Invite has expired" }` or `{ "error": "Invite has no uses left" }`
- **Code:** `404 Not Found` - **Body:** `{ "error": "Invite not found" }`
- **Code:** `409 Conflict` - **Body:** `{ "error": "User with this email already exists" }`

---

## 3. Media & Posts

Handles media uploads and the creation/viewing of posts.

### 3.1 Get Upload URL

- **Endpoint:** `POST /media/signed-url`
- **Description:** Requests a temporary, one-time URL to upload a file to. This is the first step in the two-stage upload process.
- **Authentication:** **Required**.

**Request Body:**
```json
{
    "contentType": "image/jpeg"
}
```

**Success Response:**
- **Code:** `200 OK`
- **Body:**
```json
{
    "mediaId": 123,
    "uploadUrl": "/media/upload/123"
}
```

---

### 3.2 Upload File

- **Endpoint:** `PUT /media/upload/{mediaId}`
- **Description:** Uploads the raw binary file data to the temporary URL obtained in the previous step.
- **Authentication:** None required.

**Request Body:**
- The raw binary data of the file (e.g., the image itself).
- The `Content-Type` header must match the type specified in the `signed-url` request.

**Success Response:**
- **Code:** `200 OK`
- **Body:** Empty

---

### 3.3 Confirm File Upload

- **Endpoint:** `POST /media/confirm`
- **Description:** Confirms that the file upload is complete, moving the file to permanent storage and marking it as ready for use.
- **Authentication:** **Required**.

**Request Body:**
```json
{
    "mediaId": 123
}
```

**Success Response:**
- **Code:** `200 OK`
- **Body:** Empty

---

### 3.4 Create a Post

- **Endpoint:** `POST /posts`
- **Description:** Creates a new post, optionally linking one or more previously uploaded media items.
- **Authentication:** **Required**.

**Request Body:**
```json
{
    "type": "text_and_media",
    "content": {
        "text": "Here's a great photo from our trip!"
    },
    "mediaIds": [ 123 ]
}
```

**Success Response:**
- **Code:** `200 OK`
- **Body:** A `PostDto` object.
```json
{
    "id": 1,
    "authorId": 1,
    "type": "text_and_media",
    "contentJson": {
        "text": "Here's a great photo from our trip!"
    },
    "media": [
        {
            "id": 123,
            "contentType": "image/jpeg",
            "storagePath": "uploads/123",
            "createdAt": "2024-05-25T10:00:00.000Z"
        }
    ],
    "createdAt": "2024-05-25T10:05:00.000Z"
}
```

**Error Responses:**
- **Code:** `404 Not Found` - **Body:** `{ "error": "Could not find media with the following IDs: [999]" }`
- **Code:** `403 Forbidden` - **Body:** `{ "error": "Media 124 does not belong to the same family as the post." }`

---

### 3.5 Get Family Posts (Pagination)

- **Endpoint:** `GET /posts/families/{familyId}/posts`
- **Description:** Retrieves a paginated list of posts for a given family, sorted from newest to oldest.
- **Authentication:** **Required**.

**Query Parameters:**
- `limit` (optional, default: 20): The number of posts to retrieve per page.
- `cursor` (optional): The `nextCursor` value from a previous response to get the next page.

**Success Response (First Page):**
- **Code:** `200 OK`
- **Body:**
```json
{
    "posts": [
        // ...array of PostDto objects
    ],
    "nextCursor": "MjAyNC0wNS0yNVQxMDowNTowMC4wMDBaXzE="
}
```

**Success Response (Last Page):**
- **Code:** `200 OK`
- **Body:**
```json
{
    "posts": [
        // ...array of the final PostDto objects
    ],
    "nextCursor": null
}
```

---

## 4. Users

### 4.1 Get Current User

- **Endpoint:** `GET /users/me`
- **Description:** Retrieves the profile information for the currently authenticated user.
- **Authentication:** **Required**.

**Success Response:**
- **Code:** `200 OK`
- **Body:**
```json
{
    "id": 1,
    "firstName": "Bob",
    "lastName": "Belcher",
    "email": "bob@bobsburgers.com"
}
```

**Error Responses:**
- **Code:** `401 Unauthorized`
- **Body:** `{ "error": "Unauthorized" }`
