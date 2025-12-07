# FamilyHearth API

Welcome to the FamilyHearth API! This is the backend service for a private social media application designed for families.

This document provides a guide for setting up and running the application, and a complete walkthrough of a typical end-to-end user flow.

## Prerequisites

1.  **Java 21**: Ensure you have JDK 21 installed.
2.  **Maven**: This project uses Maven for dependency management.
3.  **PostgreSQL**: A running PostgreSQL instance is required.
4.  **Postman**: The Postman desktop client is recommended for testing the API.

## Running the Application

1.  **Create the Database**:
    -   In PostgreSQL, create a new database named `family_hearth`.
    -   Create a user (role) named `fh_user` with the password `fh_password`.
    -   Grant all privileges on the `family_hearth` database to the `fh_user` role.

2.  **Configure the Application**:
    -   The database connection is configured in `src/main/resources/application.yaml`. Verify the settings match your local PostgreSQL setup.
    -   The application uses environment variables for JWT secrets, but includes safe defaults for local development.

3.  **Build and Run**:
    -   Open a terminal in the project root directory.
    -   Run the application using the Maven wrapper:
        ```sh
        ./mvnw spring-boot:run
        ```
    -   The API will start on `http://localhost:8080`.

## Testing the API: A Complete End-to-End Flow

This walkthrough uses the Postman collection located in the `/documentation/postman` directory to simulate a complete user journey.

... (The rest of the testing flow remains the same) ...

## Further Documentation

For more detailed information on specific endpoints, data models, or frontend integration, please refer to the documents inside the `/documentation` directory:

-   **`/documentation/API_DOCUMENTATION.md`**: A detailed reference for every API endpoint.
-   **`/documentation/FRONTEND_GUIDE.md`**: A guide for UI developers on how to consume the API from a React application.
-   **`/documentation/specs/api-spec.yml`**: The complete OpenAPI 3.0 specification for the API.
