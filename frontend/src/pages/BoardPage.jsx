import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import FilterBar from "../components/FilterBar";
import TaskForm from "../components/TaskForm";
import Column from "../components/Column";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useTasks } from "../hooks/useTasks";
import { STATUSES } from "../data/statuses";
import { filterTasks } from "../utils/filterTasks";

const BoardPage = () => {
  const { tasks, status, error, reload, addTask, deleteTask, moveTask } =
    useTasks();
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);

  // filters live in the url so links and refreshes keep them
  const filters = {
    query: searchParams.get("q") || "",
    status: searchParams.get("status") || "",
    assignee: searchParams.get("assignee") || "",
    view: searchParams.get("view") || "",
  };
  const hasActiveFilters = Boolean(
    filters.query ||
    filters.status ||
    filters.assignee ||
    (filters.view && filters.view !== "all"),
  );

  const visibleTasks = filterTasks(tasks, filters);
  // earliest due date first, so overdue stuff sits at the top
  const byStatus = (s) =>
    visibleTasks
      .filter((t) => t.status === s)
      .sort((a, b) => (a.dueDate || "9999").localeCompare(b.dueDate || "9999"));
  const assignees = [...new Set(tasks.map((t) => t.assignee))];

  const handleAddTask = (task) => {
    addTask(task);
    setShowForm(false);
  };

  return (
    <div className="board-page">
      <TopBar onNewTask={() => setShowForm((v) => !v)} />

      {status === "loading" && <LoadingState />}
      {status === "error" && <ErrorState message={error} onRetry={reload} />}

      {status === "success" && (
        <main className="board-main">
          {showForm && <TaskForm onAddTask={handleAddTask} />}
          <FilterBar assignees={assignees} />

          {visibleTasks.length === 0 && (
            <EmptyState
              message={
                hasActiveFilters
                  ? "No tasks match the current filters."
                  : "No tasks yet. Hit + new task to get started."
              }
            />
          )}

          <div className="board-columns">
            {STATUSES.map((s) => (
              <Column
                key={s}
                title={s}
                tasks={byStatus(s)}
                onDeleteTask={deleteTask}
                onMoveTask={moveTask}
              />
            ))}
          </div>
        </main>
      )}
    </div>
  );
};

export default BoardPage;
