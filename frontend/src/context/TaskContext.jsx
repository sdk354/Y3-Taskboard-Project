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

  // logging in doesn't remount this provider, so the initial fetch
  // needs to run again once a token exists
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
    try {
      const created = await api.createTask(newTask);
      setTasks((prev) => [...prev, created]);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const deleteTask = useCallback(
    async (taskId) => {
      const index = tasks.findIndex(
        (task) => task.id === taskId,
      );

      if (index === -1) return;

      const task = tasks[index];

      // optimistic UI update
      setTasks((prev) =>
        prev.filter((item) => item.id !== taskId),
      );

      try {
        // MongoDB delete needs _id, not the custom task.id
        await api.deleteTask(task._id);

        setLastDeleted({
          task,
          index,
        });

        clearTimeout(undoTimer.current);

        undoTimer.current = setTimeout(() => {
          setLastDeleted(null);
        }, 6000);
      } catch (err) {
        // restore task if the database delete fails
        setTasks((prev) => {
          const next = [...prev];
          next.splice(
            Math.min(index, next.length),
            0,
            task,
          );
          return next;
        });

        setError(err.message);
      }
    },
    [tasks],
  );

  const undoDelete = useCallback(async () => {
    if (!lastDeleted) return;

    clearTimeout(undoTimer.current);

    const { task, index } = lastDeleted;
    setLastDeleted(null);

    try {
      const created = await api.createTask(task);

      setTasks((prev) => {
        const next = [...prev];

        next.splice(
          Math.min(index, next.length),
          0,
          created,
        );

        return next;
      });
    } catch (err) {
      setError(err.message);
    }
  }, [lastDeleted]);

  const updateTask = useCallback(
    async (taskId, changes) => {
      const task = tasks.find(
        (item) => item.id === taskId,
      );

      if (!task) return;

      const previousTask = { ...task };

      // optimistic UI update
      setTasks((prev) =>
        prev.map((item) =>
          item.id === taskId
            ? { ...item, ...changes }
            : item,
        ),
      );

      try {
        // MongoDB update needs _id, not the custom task.id
        const updatedTask = await api.updateTask(
          task._id,
          changes,
        );

        // replace optimistic version with actual DB response
        setTasks((prev) =>
          prev.map((item) =>
            item.id === taskId
              ? updatedTask
              : item,
          ),
        );
      } catch (err) {
        // rollback if MongoDB update fails
        setTasks((prev) =>
          prev.map((item) =>
            item.id === taskId
              ? previousTask
              : item,
          ),
        );

        setError(err.message);
      }
    },
    [tasks],
  );

  const moveTask = useCallback(
    (taskId, newStatus) => {
      // don't let an invalid status strand a task
      if (!STATUSES.includes(newStatus)) return;

      updateTask(taskId, {
        status: newStatus,
      });
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

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};