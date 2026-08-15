# bugboard frontend

Vite + React SPA. See the root README for the project overview.

```
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run lint       # oxlint
npx prettier --write src   # run before committing, keeps diffs clean
```

Things worth knowing:

- Components never call fetch or localStorage directly — everything goes
  through `src/api/tasks.js`. It fakes a server (artificial delay, data kept in
  localStorage) until the real backend lands. `?fail` on any URL makes the
  fetch reject so you can see the error state.
- Status strings come from `src/data/statuses.js`. Don't hardcode "To Do" etc.
  anywhere — the columns filter by exact match and a typo hides the task
  silently.
- Filters (search, status, assignee, All/Bugs/Mine) are URL params, so
  filtered views are shareable links.
- Fonts are Kalam + Baloo 2 from Google Fonts, loaded in index.html. Theme is
  a `data-theme` attribute on `<html>` with CSS variables in index.css.
- `vercel.json` has the SPA rewrite so deep links like /tasks/3 work on
  Vercel. Don't delete it.
