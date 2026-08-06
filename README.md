# bugboard

Group project for the Full Stack Development Workshop (Aug 2026). We're building a
kanban-style board for tracking dev work and bug reports — create tasks/bug tickets,
move them between To Do / In Progress / Done, and eventually see teammates' changes
live.

Built up over 5 weekly sessions, one layer per session:

| Session | Adds |
|---------|------|
| 1 | React frontend with mock data |
| 2 | Node/Express REST API + JWT auth |
| 3 | MongoDB (Mongoose) + offline support |
| 4 | Tests (Jest, RTL, Supertest) + GitHub Actions CI |
| 5 | Socket.io real-time sync, Docker, deployment |

Right now we're on session 1, so only the frontend scaffold exists. The `server/`
folder will come in session 2.

## Running it

You need Node 20+.

```
cd frontend
npm install
npm run dev
```

Opens on http://localhost:5173.

`npm run build` for a production build, `npm run lint` to lint.

## Repo layout

```
frontend/          Vite + React app
  src/
    api/           fetch wrappers (components never call fetch directly)
    components/    reusable bits (TaskCard, Column, etc.)
    context/       shared state providers
    data/          mock data until the real API exists
    hooks/
    pages/         one component per route
    utils/
```

Most of these folders are empty for now — they get filled in as the assignment
tasks are done.

## Working agreement

Feature branches + PRs into main. Don't push straight to main, and don't squash —
commit history is part of the grading. Roles rotate each session so everyone
touches frontend, backend and testing at some point.

## Notes

- `npm audit` flags a high severity issue in react-router. It only applies to RSC
  server mode which we don't use (plain Vite SPA), and the suggested fix is
  actually a downgrade, so we're ignoring it.
- The Vite template ships with oxlint now instead of ESLint. Both are installed
  at the moment — we'll pick one and delete the other.
