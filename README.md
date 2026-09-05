# BugBoard - Full Stack Development Workshop

## Project Overview

BugBoard is a full-stack Kanban-style task and bug tracking application
developed for the Full Stack Development Workshop (Aug 2026).

The system allows development teams to: - Create tasks and bug reports -
Move tasks through workflow stages: - To Do - In Progress - In Review -
Done - Manage task details - Authenticate users securely - Communicate
between React frontend and Express backend through REST APIs

The project evolved through multiple development stages, starting from a
React frontend prototype and progressing into a full-stack application.

------------------------------------------------------------------------

# Technology Stack

## Frontend

-   React 19
-   Vite
-   React Router DOM
-   Context API
-   JavaScript ES Modules
-   CSS Theme System

## Backend

-   Node.js
-   Express.js
-   JWT Authentication
-   bcrypt password hashing
-   dotenv
-   CORS
-   MongoDB Atlas + Mongoose

------------------------------------------------------------------------

# Project Architecture

    BugBoard
    |
    ├── frontend/
    |   ├── src/
    |   |   ├── api/
    |   |   ├── components/
    |   |   ├── context/
    |   |   ├── hooks/
    |   |   ├── pages/
    |   |   ├── utils/
    |   |   └── App.jsx
    |
    └── backend/
        └── src/
            ├── config/
            ├── controllers/
            ├── routes/
            ├── middleware/
            ├── services/
            ├── repositories/
            ├── models/
            ├── seeds/
            ├── validators/
            ├── utils/
            ├── app.js
            └── server.js

------------------------------------------------------------------------

# Frontend Implementation

Completed features:

-   Kanban board interface
-   Task creation
-   Task editing
-   Task deletion
-   Undo delete functionality
-   Drag and drop between columns
-   Mobile touch drag support
-   Search functionality
-   Status filtering
-   Assignee filtering
-   Task detail page
-   Light/dark theme
-   Loading states
-   Error states
-   Empty states

The frontend task object is the main application contract:

``` javascript
{
  id,
  key,
  type,
  severity,
  title,
  assignee,
  status,
  dueDate,
  tag
}
```

------------------------------------------------------------------------

# Backend Implementation

Completed features:

-   Express REST API
-   Authentication system
-   User registration
-   User login
-   JWT token generation
-   JWT verification middleware
-   Protected task routes
-   Task CRUD APIs
-   Frontend-compatible task response format
-   MongoDB Atlas persistence via Mongoose (tasks and users)
-   Database seed script (`npm run seed`)
-   Optimistic concurrency control on task updates (`version` field, 409 on conflict)

------------------------------------------------------------------------

# Database

Tasks and users are persisted in MongoDB (Atlas in production, a local
`mongod` for development) via Mongoose schemas.

-   `MONGO_URI` in `backend/.env` points at either a local instance or
    an Atlas connection string.
-   `npm run seed` (inside `backend/`) loads the demo users and tasks.
-   Task documents carry a `version` field and automatic
    `createdAt`/`updatedAt` timestamps. Updates must include the last
    known `version`; a stale version is rejected with `409 Conflict`
    instead of silently overwriting a concurrent edit.

See `backend/README.md` for the full schema, seed data, and
concurrency-handling notes.

------------------------------------------------------------------------

# Authentication Flow

    User
     |
    Register/Login
     |
    Backend validates credentials
     |
    JWT token generated
     |
    Frontend stores token
     |
    Frontend sends token with requests
     |
    Backend verifies JWT
     |
    Protected APIs become available

Authorization format:

    Authorization: Bearer JWT_TOKEN

------------------------------------------------------------------------

# API Structure

## Authentication Routes

    POST /api/auth/register
    POST /api/auth/login
    GET  /api/auth/me

## Task Routes

    GET    /api/tasks
    POST   /api/tasks
    PATCH  /api/tasks/:id
    DELETE /api/tasks/:id

------------------------------------------------------------------------

# Frontend-Backend Integration

Completed:

-   Removed dependency on fake task storage
-   Connected frontend API layer with Express backend
-   Added JWT authorization headers
-   Backend responses follow frontend contract
-   Protected API communication

------------------------------------------------------------------------

# Current Status

## Completed

✅ React frontend\
✅ Express backend\
✅ JWT authentication\
✅ Protected routes\
✅ Frontend-backend connection\
✅ Task CRUD operations\
✅ User authentication\
✅ Logout functionality\
✅ API documentation\
✅ MongoDB Atlas persistence\
✅ Database seed script\
✅ Optimistic concurrency control (task versioning)

## Future Improvements

-   Real-time updates with Socket.io
-   Automated testing
-   CI/CD pipeline
-   Docker deployment
-   Production deployment improvements

------------------------------------------------------------------------

# Development Commands

## Frontend

``` bash
cd frontend
npm install
npm run dev
```

Runs:

    http://localhost:5173

## Backend

``` bash
cd backend
npm install
cp .env.example .env   # set MONGO_URI (local mongod or an Atlas connection string) and JWT_SECRET
npm run seed            # optional: load demo users and tasks
npm run dev
```

Runs:

    http://localhost:4000

------------------------------------------------------------------------

# Development Rules

-   Keep frontend task structure as the main API contract.
-   Components should not directly handle API requests.
-   Use API modules for backend communication.
-   Keep authentication logic inside authentication context/hooks.
-   Avoid hardcoding status values.
-   Use feature branches and pull requests for changes.

------------------------------------------------------------------------

# Project Documentation

Detailed documentation exists in:

-   Frontend README
-   Backend README
-   API Documentation

This document provides the overall project understanding for developers
and future maintenance.
