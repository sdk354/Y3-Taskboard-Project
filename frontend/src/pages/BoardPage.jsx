import React from "react";
import { useSearchParams } from "react-router-dom";
import Column from "../components/Column";
import TaskForm from "../components/TaskForm";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import { useTasks } from "../hooks/useTasks";
import { useTheme } from "../hooks/useTheme";
import { STATUSES } from "../data/statuses";
import { filterTasks } from "../utils/filterTasks";

const BoardPage = () => {
  const { tasks, addTask, deleteTask, moveTask } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();

  // Filters live in the URL, so refreshes and shared links keep them applied
  const filters = {
    query: searchParams.get("q") || "",
    status: searchParams.get("status") || "",
    assignee: searchParams.get("assignee") || "",
  };
  const hasActiveFilters = Boolean(
    filters.query || filters.status || filters.assignee,
  );

  const visibleTasks = filterTasks(tasks, filters);

  const getTasksByStatus = (status) =>
    visibleTasks.filter((task) => task.status === status);

  const assignees = [...new Set(tasks.map((t) => t.assignee))];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={toggleTheme} style={{ marginBottom: "10px" }}>
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </div>

      <TaskForm onAddTask={addTask} />
      <FilterBar assignees={assignees} />

      {visibleTasks.length === 0 && (
        <EmptyState
          message={
            hasActiveFilters
              ? "No tasks match the current filters."
              : "No tasks yet. Add one above to get started."
          }
        />
      )}

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {STATUSES.map((status) => (
          <Column
            key={status}
            title={status}
            tasks={getTasksByStatus(status)}
            onDeleteTask={deleteTask}
            onMoveTask={moveTask}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardPage;
