# BugBoard Backend API

Backend API for the BugBoard task management application.

## Tech Stack

-   Node.js
-   Express.js
-   MongoDB (planned database integration)
-   Mongoose
-   JWT Authentication
-   Socket.io (planned)

## Project Setup

Install dependencies:

``` bash
npm install
```

Environment variables:

``` env
PORT=4000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_secret_key
```

Run development server:

``` bash
npm run dev
```

Server:

    http://localhost:4000

# API Documentation

## Authentication

Base route:

    /api/auth

## Register

    POST /api/auth/register

Body:

``` json
{
  "username":"testuser",
  "password":"password123"
}
```

## Login

    POST /api/auth/login

Body:

``` json
{
  "username":"testuser",
  "password":"password123"
}
```

Response:

``` json
{
  "data":{
    "token":"JWT_TOKEN"
  }
}
```

## Current User

    GET /api/auth/me

Header:

    Authorization: Bearer JWT_TOKEN

# Task APIs

All task APIs require JWT authentication.

Base route:

    /api/tasks

Header:

    Authorization: Bearer JWT_TOKEN

## Get Tasks

    GET /api/tasks

## Create Task

    POST /api/tasks

## Update Task

    PATCH /api/tasks/:id

## Delete Task

    DELETE /api/tasks/:id

# Frontend Task Contract

The frontend structure is the main contract.

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

# Authentication Flow

User logs in, backend generates JWT, frontend stores token, and every
protected API request sends:

    Authorization: Bearer TOKEN

Backend verifies the token before allowing access.

# Current Status

Completed: - Backend API - Authentication - JWT middleware - Protected
task routes - Frontend API integration - Task CRUD integration

Remaining: - MongoDB persistence - Socket.io real-time features -
Additional production improvements
