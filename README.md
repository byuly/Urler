# Urler | URL Analytics Platform  аналиitics

`Urler` is a full-stack web application designed to shorten long URLs and provide detailed analytics on their usage. It offers a clean interface for users to create short links and monitor their performance through a real-time dashboard.

## Core Features

*   **URL Shortening:** Convert long, cumbersome URLs into short, easy-to-share links.
*   **Click Tracking:** Automatically track every time a shortened link is clicked.
*   **Analytics Dashboard:** View click data, including total clicks and other metrics, updated in real-time.
*   **User Authentication:** Securely manage your links under your own account.

## Tech Stack

### Frontend
*   **Framework:** Next.js (React)
*   **Language:** TypeScript

### Backend
*   **Framework:** Spring Boot
*   **Language:** Java
*   **Real-time Communication:** WebSockets
*   **Security:** Spring Security with JWT

### Infrastructure
*   **Containerization:** Docker

## Architecture

Here is a high-level overview of the application's architecture.

```mermaid
graph TD
    subgraph "Client"
        User[User] --> Frontend[Next.js Frontend]
    end

    subgraph "Backend (Spring Boot)"
        API[REST API <br> (Auth, URL Management)]
        Websocket[WebSocket <br> (Real-time Analytics)]
        Redirect[Redirect Service]
    end

    subgraph "Data Layer"
        Database[(PostgreSQL)]
    end

    Frontend -- "HTTP/S" --> API
    Frontend -- "WebSocket" --> Websocket
    User -- "Access Short URL" --> Redirect
    API --> Database
    Redirect --> Database
```
