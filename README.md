# Family Hearth

Connecting families — Family Hearth is a small web + Java project intended to help families share updates, photos, and events in a private, family-focused space.

---

## Table of contents
- Project overview
- Features
- Tech stack
- Prerequisites
- Run locally (quick start)
  - Backend (Java)
  - Frontend (static files / JavaScript)
- Common commands
- How to contribute
- Troubleshooting
- License & contact

---

## Project overview
Family Hearth is a simple project to "connect families" by providing a lightweight web application that combines a Java-based backend with a JavaScript/CSS/HTML frontend. The repository language composition is primarily:
- Java (~59%)
- JavaScript (~26%)
- CSS (~14%)
- HTML (~2%)

This README gives step-by-step instructions to set up the project locally and get started contributing.

---

## Features (example)
- Private family feed for updates
- Event calendar
- Photo sharing (basic)
- Simple user management (invite-only)

(If your repo has different features, replace this list with the actual ones.)

---

## Tech stack
- Backend: Java (plain Java, servlet, or framework — check your project files for Gradle/Maven or Spring Boot)
- Frontend: HTML, CSS, JavaScript (static or single-page app)
- Optional: Build tools such as Maven or Gradle, and Node.js for local static serving or frontend tooling

---

## Prerequisites
Install the tools you need on your machine:
- Java JDK 11+ (or the version your project requires)
- Git
- Optionally:
  - Maven or Gradle (if the project uses them)
  - Node.js and npm (if frontend has npm scripts or you want a simple static server)

You can check versions with:
- java -version
- git --version
- mvn -v (if using Maven)
- gradle -v (if using Gradle)
- node -v and npm -v (if using Node)

---

## Run locally (quick start)

These are generic steps. Inspect your repository for a build file (pom.xml, build.gradle) or a README.md inside backend/frontend folders; replace example commands as needed.

1. Clone the repo
   - git clone https://github.com/mayur-ravindram/family-hearth.git
   - cd family-hearth

2. Backend (Java)
   - If the project uses Maven (pom.xml exists):
     - mvn clean package
     - mvn spring-boot:run    (if Spring Boot)
     - or run the built jar: java -jar target/your-app.jar
   - If the project uses Gradle (build.gradle exists):
     - ./gradlew bootRun        (on Unix/macOS)
     - gradlew.bat bootRun      (on Windows)
     - or build then run the jar: ./gradlew build && java -jar build/libs/your-app.jar
   - If it is a plain Java app:
     - Find the main class (e.g., src/main/java/...)
     - javac -d out $(find src -name "*.java")
     - java -cp out com.example.Main
   - After starting the backend, it usually listens on http://localhost:8080 (check your app logs or config)

3. Frontend (static HTML/CSS/JS)
   - If the frontend is static files (index.html present):
     - You can open index.html directly in the browser for many setups.
     - Or run a small local server (recommended to avoid CORS issues):
       - Using Python 3: python3 -m http.server 3000
       - Using Node (install http-server): npx http-server ./frontend -p 3000
     - Open http://localhost:3000 (or the port you used)
   - If the frontend has an npm workflow:
     - cd frontend (if applicable)
     - npm install
     - npm start
     - Follow the printed URL (commonly http://localhost:3000)

4. Connect frontend & backend
   - Ensure the frontend API endpoints point to the backend host/port (e.g., http://localhost:8080/api)
   - If using CORS, ensure the backend allows requests from your frontend origin
