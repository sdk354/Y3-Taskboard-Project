import { CURRENT_USER } from "../data/users";

export function filterTasks(tasks, { query, status, assignee, view }) {
  return tasks.filter((t) => {
    const matchesQuery =
      !query || t.title.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = !status || t.status === status;
    const matchesAssignee = !assignee || t.assignee === assignee;
    const matchesView =
      !view ||
      view === "all" ||
      (view === "bugs" && t.type === "bug") ||
      (view === "mine" && t.assignee === CURRENT_USER);
    return matchesQuery && matchesStatus && matchesAssignee && matchesView;
  });
}
