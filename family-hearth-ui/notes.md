# Understanding Access token vs Refresh Token
The accessToken is used for every single API request to prove you have permission to access a resource. But because it's sent so often, it's intentionally designed to be short-lived (e.g., 30 seconds, 15 minutes). This is a security measure. If an accessToken were ever stolen, its usefulness to an attacker would be very brief.

The refreshToken is the key to a smooth user experience. It is long-lived (e.g., 7 days, 30 days) and has only one, single purpose: to securely get a new accessToken when the old one expires.

Think of it this way:

Access Token: A temporary, single-use ticket to get into a concert venue. You show it for one entry.
Refresh Token: The season pass you keep securely in your wallet. You don't show it for every entry. You only use it at the box office once your single-use ticket has been used or expires to get a new ticket for the next show.
Here is a diagram illustrating the complete flow, showing how both tokens are used.

```mermaid
sequenceDiagram
    participant Browser
    participant API Server
    
    %% --- Initial Login ---
    Note over Browser, API Server: Initial Login
    Browser->>API Server: 1. User logs in (e.g., with magic link)
    API Server-->>Browser: 2. Returns a short-lived accessToken <br/> and a long-lived refreshToken
    Browser->>Browser: 3. Stores both tokens securely

    %% --- Happy Path ---
    Note over Browser, API Server: "Happy Path" (accessToken is VALID)
    Browser->>API Server: 4. Request data using accessToken
    API Server->>API Server: 5. Validates accessToken (✅ Success)
    API Server-->>Browser: 6. Returns requested data
    Browser->>API Server: 7. Request more data using same accessToken
    API Server->>API Server: 8. Validates accessToken (✅ Success)
    API Server-->>Browser: 9. Returns more data

    %% --- Refresh Path ---
    Note over Browser, API Server: "Refresh Path" (accessToken has EXPIRED)
    Browser->>API Server: 10. Request data using EXPIRED accessToken
    API Server->>API Server: 11. Validates accessToken (❌ Failure - Expired)
    API Server-->>Browser: 12. Returns `403 Forbidden` error
    
    Note over Browser: Interceptor catches the 403 error!
    
    Browser->>API Server: 13. Sends **refreshToken** to special `/auth/refresh` endpoint
    API Server->>API Server: 14. Validates refreshToken (✅ Success)
    API Server-->>Browser: 15. Returns a **NEW** accessToken
    Browser->>Browser: 16. Stores the new accessToken, overwriting the expired one
    
    Note over Browser: Interceptor now retries the original failed request.
    
    Browser->>API Server: 17. **Retries** request for data using the NEW accessToken
    API Server->>API Server: 18. Validates new accessToken (✅ Success)
    API Server-->>Browser: 19. Returns requested data
```