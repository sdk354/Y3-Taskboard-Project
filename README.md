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

Session 1 (the frontend) is done — tasks 1 through 6 are merged. The board has
create/move/delete with undo, drag and drop between columns, search + filters
that live in the URL, routing with a task detail page (editable), light/dark
mode, and loading/error/empty states backed by a fake API layer in
`src/api/tasks.js`. The `server/` folder comes in session 2, at which point the
fake API gets swapped for real fetch calls.

Live at **https://bugboard-nsbm.vercel.app** — deploys automatically from main
via Vercel, and every PR gets its own preview link. Add `?fail` to the URL to
see the error state.

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
    api/           fake api for now (delay + localStorage), real fetch later
    components/    TaskCard, Column, TopBar, TaskForm, Dropdown, states, ...
    context/       TaskProvider (board state) and ThemeProvider
    data/          seed tasks, status constants, team members
    hooks/         useTasks / useTheme
    pages/         BoardPage, TaskDetail, NotFound
    utils/         filtering, date helpers, note colours
```

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
