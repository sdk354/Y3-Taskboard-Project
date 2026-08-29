# BugBoard Backend API

Backend API for the BugBoard task management application.

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.io (planned)

## Project Setup

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file inside the `backend` directory.

Use `.env.example` as the template:

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/bugboard
JWT_SECRET=your_secret_key
```

Do not commit the `.env` file to Git.

## MongoDB Setup

The backend uses MongoDB through Mongoose.

Make sure MongoDB is running locally before starting the backend.

The default database connection is:

```text
mongodb://localhost:27017/bugboard
```

## Database Seeding

The seed script loads the existing mock users and tasks into MongoDB.

Run:

```bash
npm run seed
```

The seed script creates the mock users and tasks in the MongoDB database.

For the current development dataset, the seed creates:

* 3 users
* 8 tasks

## Run Development Server

```bash
npm run dev
```

Server:

```text
http://localhost:4000
```

# API Documentation

## Authentication

Base route:

```text
/api/auth
```

### Register

```text
POST /api/auth/register
```

Body:

```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "password123"
}
```

### Login

```text
POST /api/auth/login
```

Body:

```json
{
  "username": "testuser",
  "password": "password123"
}
```

Response:

```json
{
  "data": {
    "token": "JWT_TOKEN"
  }
}
```

### Current User

```text
GET /api/auth/me
```

Header:

```text
Authorization: Bearer JWT_TOKEN
```

# Task APIs

All task APIs require JWT authentication.

Base route:

```text
/api/tasks
```

Header:

```text
Authorization: Bearer JWT_TOKEN
```

## Get Tasks

```text
GET /api/tasks
```

## Create Task

```text
POST /api/tasks
```

## Update Task

```text
PATCH /api/tasks/:id
```

## Delete Task

```text
DELETE /api/tasks/:id
```

# Task Versioning and Concurrency

Tasks use optimistic concurrency control.

Each task contains a `version` field and automatic timestamps:

```json
{
  "version": 0,
  "createdAt": "...",
  "updatedAt": "..."
}
```

The `updatedAt` field is managed automatically by Mongoose through:

```javascript
timestamps: true
```

When updating a task, the client must send the version it last received.

Example:

```json
{
  "title": "Updated task title",
  "version": 0
}
```

When the update succeeds, the backend increments the version:

```text
version 0 → version 1
```

The `updatedAt` value is also updated automatically.

### Conflict Detection

If another user has already modified the task, the submitted version is stale.

The backend rejects the update and returns:

```text
409 Conflict
```

Example response:

```json
{
  "message": "Task was modified by another user. Please refresh and try again."
}
```

The stale update is therefore not allowed to overwrite the newer task data.

# Migration Notes

The task schema includes a `version` field for optimistic concurrency control and automatic `createdAt` / `updatedAt` timestamps.

For a fresh development database, run:

```bash
npm run seed
```

Seeded tasks start with:

```text
version = 0
```

For an existing MongoDB database created before versioning was introduced, existing task documents should be migrated so that documents without a `version` field receive:

```text
version = 0
```

The `createdAt` and `updatedAt` fields are managed automatically by Mongoose.

# Frontend Task Contract

The frontend task object includes:

```javascript
{
  id,
  key,
  type,
  severity,
  title,
  assignee,
  status,
  dueDate,
  tag,
  version,
  createdAt,
  updatedAt
}
```

# Authentication Flow

The user logs in and the backend generates a JWT.

The frontend stores the token, and every protected API request sends:

```text
Authorization: Bearer TOKEN
```

The backend verifies the token before allowing access to protected routes.

# Current Status

Completed:

* Backend API
* Authentication
* JWT middleware
* Protected task routes
* Frontend API integration
* Task CRUD integration
* MongoDB persistence
* Database seed script
* Task versioning
* `updatedAt` timestamps
* Optimistic concurrency conflict detection
* MongoDB setup documentation
* Database migration notes

Planned:

* Socket.io real-time features
* Additional production improvements
