# Urler | URL Analytics Platform

**Urler** is a full-stack web application for shortening long URLs and tracking their usage with real-time analytics. It provides a clean, intuitive interface for creating short links and monitoring their performance.

* **URL Shortening** – Convert long URLs into short, easy-to-share links.
* **Click Tracking** – Capture every click on shortened URLs.
* **Analytics Dashboard** – View click metrics updated in real time.
* **User Authentication** – Securely manage links under individual accounts.

## the tech stack

### Backend

* **Framework:** Spring Boot
* **Language:** Java
* **Real-time Communication:** WebSockets
* **Security:** Spring Security + JWT

### Frontend

* **Framework:** Next.js (React)
* **Language:** TypeScript

### Infrastructure

* **Database:** PostgreSQL
* **Containerization:** Docker

## architecture

```mermaid
graph TD
    subgraph Client
        User[User]
        Frontend[Next.js Frontend]
        User --> Frontend
    end

    subgraph Backend
        API[Auth & URL management]
        WebSocket[live click analytics]
        Redirect[Redirect Service]
        Frontend -->|REST API| API
        Frontend -->|WebSocket| WebSocket
        User -->|Access Short URL| Redirect
    end

    subgraph Database
        DB[(PostgreSQL)]
        API --> DB
        Redirect --> DB
    end

```

## starting application

### prerequisites

* Node.js (>=18)
* Java (>=17)
* Docker (optional, for containerized deployment)

### installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/byuly/Urler.git
   cd urler
   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

4. **(Optional) Run with Docker**

   ```bash
   docker-compose up --build
   ```
   
5. **(Optional) To run tests**
   ```bash
   ./mvnw test
   ```
