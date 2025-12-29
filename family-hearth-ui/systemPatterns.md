# System Patterns

## Architecture Pattern
- **Type:** Frontend UI Application (Inferred from `family-hearth-ui`).
- **Framework:** React.
- **Language:** TypeScript.
- **Approach:** Client-Server SPA. The frontend communicates with a backend API via HTTP requests.

## Data Flow
- **Flow:** React Components -> `useEffect` (Manual Fetch) -> REST API -> Database.
- **File Uploads:** Direct to storage via pre-signed URLs.

## Component Patterns
- **Strategy:** Functional Components with Hooks.
- **Styling:** Separate CSS files for each component (potential for global namespace collisions).
- **UI Library:** Custom implementation (Documentation suggests adopting Material-UI or similar in the future).

## State Management
- **Global:** `localStorage` for tokens; `window` events for login status (identified as technical debt).
- **Server State:** Managed locally within components via `useEffect` (no dedicated library like React Query yet).
- **Local:** React `useState` and `useEffect`.

## API Strategy
- **Communication:** RESTful API (v1 endpoints).
- **Authentication:** Magic Link flow returning JWT and Refresh Token.
- **Endpoints:** e.g., `/api/v1/auth/magic-link`, `/api/v1/users/me/family`.

## Naming & Style Conventions
- **Linting:** ESLint is utilized.
- **Components:** PascalCase (e.g., `Dashboard.js`, `MagicLinkVerification`).
- **Files:** Component files appear to use PascalCase based on documentation references.

## Technical Debt/Inconsistencies
- **State Management:** Login status relies on non-standard `window` events.
- **Data Fetching:** Manual `useEffect` fetching leads to boilerplate and lacks caching.
- **Security:** JWT stored in `localStorage` (vulnerable to XSS).
- **UX:** Hardcoded user name in Dashboard; lack of real-time updates.
- **CSS:** Global namespace collisions due to separate CSS files without scoping (e.g., Modules).

---

## New and Updated Patterns

### Profile Management
- **Description:** A dedicated page at `/profile` allows authenticated users to view their profile information and manage their settings.
- **Components:**
  - `src/pages/Profile.jsx`: The main page component that fetches user data and handles profile updates.
  - `src/components/Navbar.jsx`: Modified to include a link to the profile page via the user's avatar.
- **Routing:** The route is defined in `src/App.jsx` and is protected to ensure only authenticated users can access it.

### Authenticated File Upload (Avatars)
- **Description:** A robust, multi-step pattern for securely uploading user-generated content (like avatars) directly to a cloud storage service. This offloads bandwidth from the main application server.
- **Flow:**
  1.  **Request Signed URL:** The client requests a temporary, secure upload URL from the backend by calling `createSignedUrl` (`POST /api/v1/media/signed-url`).
  2.  **Direct Upload:** The client uses the received signed URL to upload the file directly to the cloud storage provider (e.g., AWS S3) with a `PUT` request via the `uploadFile` function.
  3.  **Confirm Upload:** After the upload is complete, the client notifies the backend by calling `confirmMedia` (`POST /api/v1/media/confirm`).
  4.  **Associate File:** To link the uploaded file to the user's profile, the client calls `updateUser` (`PATCH /api/v1/users/me`) with the `fileId`, prompting the backend to update the user's `avatarUrl`.

### New User Onboarding Flow
- **Description:** A new flow to handle users who are not yet registered in the system, especially when they arrive from an invitation link.
- **Flow:**
  1.  **Email Check:** When a user attempts to log in, the frontend first calls a new endpoint (`GET /api/v1/users/check?email={email}`) to verify if the user exists.
  2.  **Existing User:** If the user exists, the normal magic link flow proceeds.
  3.  **New User Redirection:** If the user does not exist, the frontend redirects them to the `/onboarding` page.
  4.  **Onboarding:** The onboarding page captures the user's first name, last name, and pre-fills their email. Submitting this form triggers the magic link flow for the new user.
- **Backend Requirement:** This pattern introduces the need for the `/api/v1/users/check` endpoint on the backend to avoid sending magic links to unregistered users.