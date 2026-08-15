import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as api from "../api/tasks";
import { STATUSES } from "../data/statuses";
import { TaskContext } from "../hooks/useTasks";

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  // loading | error | success
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  // for the undo toast
  const [lastDeleted, setLastDeleted] = useState(null);
  const undoTimer = useRef(null);

  const reload = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await api.fetchTasks();
      setTasks(data);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTask = useCallback(
    (newTask) => {
      // next BUG-/TASK- number
      const numbers = tasks.map(
        (t) => Number((t.key || "").split("-")[1]) || 0,
      );
      const nextNumber = Math.max(100, ...numbers) + 1;
      const task = {
        ...newTask,
        key: `${newTask.type === "bug" ? "BUG" : "TASK"}-${nextNumber}`,
      };

      setTasks((prev) => [...prev, task]);
      api.createTask(task);
    },
    [tasks],
  );

  const deleteTask = useCallback(
    (taskId) => {
      const index = tasks.findIndex((t) => t.id === taskId);
      if (index === -1) return;

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      api.deleteTask(taskId);

      // keep it around for a bit so the toast can undo
      setLastDeleted({ task: tasks[index], index });
      clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => setLastDeleted(null), 6000);
    },
    [tasks],
  );

  const undoDelete = useCallback(() => {
    if (!lastDeleted) return;
    clearTimeout(undoTimer.current);

    const { task, index } = lastDeleted;
    setTasks((prev) => {
      const next = [...prev];
      next.splice(Math.min(index, next.length), 0, task);
      return next;
    });
    api.createTask(task);
    setLastDeleted(null);
  }, [lastDeleted]);

  const updateTask = useCallback((taskId, changes) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...changes } : t)),
    );
    api.updateTask(taskId, changes);
  }, []);

  const moveTask = useCallback(
    (taskId, newStatus) => {
      // don't let a typo'd status strand a task outside every column
      if (!STATUSES.includes(newStatus)) return;
      updateTask(taskId, { status: newStatus });
    },
    [updateTask],
  );

  const value = useMemo(
    () => ({
      tasks,
      status,
      error,
      reload,
      addTask,
      deleteTask,
      undoDelete,
      lastDeleted,
      updateTask,
      moveTask,
    }),
    [
      tasks,
      status,
      error,
      reload,
      addTask,
      deleteTask,
      undoDelete,
      lastDeleted,
      updateTask,
      moveTask,
    ],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
