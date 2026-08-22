# BugBoard Frontend

Frontend application for the BugBoard task management system.

Built using:

-   React 19
-   Vite
-   React Router DOM
-   Context API
-   JavaScript ES Modules

The frontend provides:

-   User registration
-   User login
-   JWT-based authentication handling
-   Protected application access
-   Kanban task board
-   Task CRUD operations
-   Task filtering
-   Task detail view
-   Theme switching

------------------------------------------------------------------------

# Project Setup

Install dependencies:

``` bash
npm install
```

Start development server:

``` bash
npm run dev
```

Frontend runs on:

    http://localhost:5173

Build production version:

``` bash
npm run build
```

Run lint:

``` bash
npm run lint
```

Format code:

``` bash
npx prettier --write src
```

------------------------------------------------------------------------

# Frontend Architecture

Main structure:

    src/
    ├── api
    ├── components
    ├── context
    ├── hooks
    ├── pages
    ├── utils
    ├── data
    ├── App.jsx
    └── main.jsx

------------------------------------------------------------------------

# API Communication

Components do not directly call fetch.

All API communication goes through:

    src/api/

Current API modules:

    src/api/auth.js
    src/api/tasks.js

The frontend communicates with the Express backend API.

------------------------------------------------------------------------

# Authentication Flow

Flow:

    User
     |
    Register/Login
     |
    Backend generates JWT
     |
    Frontend stores token
     |
    JWT attached to API requests
     |
    Protected backend APIs accessed

JWT is stored in browser Local Storage.

Protected requests send:

    Authorization: Bearer TOKEN

------------------------------------------------------------------------

# Task Management

The frontend task object follows the main application contract:

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

Task operations:

-   Load tasks
-   Create tasks
-   Update tasks
-   Delete tasks

------------------------------------------------------------------------

# Context Management

## AuthContext

Handles:

-   Current user
-   JWT token
-   Login state
-   Logout

## TaskContext

Handles:

-   Task data
-   Loading state
-   Error state
-   Task CRUD operations

## ThemeContext

Handles:

-   Light/dark theme switching
-   Theme persistence

------------------------------------------------------------------------

# Routing

Current routes:

    /

Protected board page.

    /tasks/:id

Task details page.

    /login

Login page.

    /register

Registration page.

    *

Not found page.

------------------------------------------------------------------------

# Important Development Rules

1.  Components should not directly call backend APIs.

2.  Use the API layer for all server communication.

3.  Keep task status values from:

```{=html}
<!-- -->
```
    src/data/statuses.js

Do not hardcode status strings.

4.  Keep frontend task structure as the API contract.

5.  Do not reintroduce localStorage task storage.

------------------------------------------------------------------------

# Current Implementation Status

Completed:

-   React task board UI
-   Task components
-   Task filtering
-   Task details page
-   Theme switching
-   Authentication pages
-   JWT token handling
-   Protected routes
-   Logout functionality
-   Backend API integration

Remaining:

-   Additional UI improvements
-   Production deployment improvements
-   Future real-time features

------------------------------------------------------------------------

# Backend Integration

Frontend communicates with:

    Express Backend API

The frontend expects backend responses to match the frontend task
contract.

Current integration supports:

-   Authentication APIs
-   Protected task APIs
-   Task CRUD operations

------------------------------------------------------------------------

END OF FRONTEND DOCUMENTATION
