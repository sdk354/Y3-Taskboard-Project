export function filterTasks(tasks, { query, status, assignee }) {
    return tasks.filter((t) => {
        const matchesQuery = !query || t.title.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = !status || t.status === status;
        const matchesAssignee = !assignee || t.assignee === assignee;
        return matchesQuery && matchesStatus && matchesAssignee;
    });
}
