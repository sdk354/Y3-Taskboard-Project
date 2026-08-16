import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import FilterBar from "../components/FilterBar";
import TaskForm from "../components/TaskForm";
import Column from "../components/Column";
import ColumnPager from "../components/ColumnPager";
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
  const [activeColumn, setActiveColumn] = useState(STATUSES[0]);
  const columnsRef = useRef(null);

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

  const counts = Object.fromEntries(
    STATUSES.map((s) => [s, byStatus(s).length]),
  );
  const assignees = [...new Set(tasks.map((t) => t.assignee))];

  // keep the pager's active chip in sync while swiping columns
  useEffect(() => {
    if (status !== "success") return;
    const el = columnsRef.current;
    if (!el) return;
    const onScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      [...el.children].forEach((col, i) => {
        const mid = col.offsetLeft + col.offsetWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveColumn(STATUSES[best]);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [status]);

  const jumpToColumn = (s) => {
    const col = columnsRef.current?.children[STATUSES.indexOf(s)];
    col?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

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
          {showForm && (
            <div
              className="sheet-backdrop"
              onClick={() => setShowForm(false)}
            />
          )}
          {showForm && <TaskForm onAddTask={handleAddTask} />}
          <FilterBar assignees={assignees} />

          <ColumnPager
            counts={counts}
            active={activeColumn}
            onJump={jumpToColumn}
            onDropTask={moveTask}
          />

          {visibleTasks.length === 0 && (
            <EmptyState
              message={
                hasActiveFilters
                  ? "No tasks match the current filters."
                  : "No tasks yet. Hit + new task to get started."
              }
            />
          )}

          <div className="board-columns" ref={columnsRef}>
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

          <button
            className="fab"
            aria-label="New task"
            onClick={() => setShowForm((v) => !v)}
          >
            +
          </button>
        </main>
      )}
    </div>
  );
};

export default BoardPage;
