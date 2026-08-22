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
import { useAuth } from "../hooks/useAuth";

export const TaskProvider = ({ children }) => {
  const { token } = useAuth();
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

  // logging in doesn't remount this provider, so the initial fetch (which
  // ran with no token) never picks up the board otherwise
  useEffect(() => {
    if (!token) {
      setTasks([]);
      setStatus("loading");
      setError(null);
      return;
    }
    reload();
  }, [token, reload]);

  const addTask = useCallback(async (newTask) => {
    // the backend assigns id/key, so wait for its response instead of
    // guessing one client-side - anything else and drag/edit/delete on
    // the new card would silently 404 until a refresh
    try {
      const created = await api.createTask(newTask);
      setTasks((prev) => [...prev, created]);
    } catch (err) {
      setError(err.message);
    }
  }, []);

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

  const undoDelete = useCallback(async () => {
    if (!lastDeleted) return;
    clearTimeout(undoTimer.current);

    const { task, index } = lastDeleted;
    setLastDeleted(null);

    // recreated task gets a new id/key from the server, same reasoning
    // as addTask - it isn't the same record it was before deletion
    try {
      const created = await api.createTask(task);
      setTasks((prev) => {
        const next = [...prev];
        next.splice(Math.min(index, next.length), 0, created);
        return next;
      });
    } catch (err) {
      setError(err.message);
    }
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
