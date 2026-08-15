import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as api from "../api/tasks";
import { STATUSES } from "../data/statuses";
import { TaskContext } from "../hooks/useTasks";

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  // loading | error | success
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

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

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    api.deleteTask(taskId);
  }, []);

  const moveTask = useCallback((taskId, newStatus) => {
    // don't let a typo'd status strand a task outside every column
    if (!STATUSES.includes(newStatus)) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
    api.updateTaskStatus(taskId, newStatus);
  }, []);

  const value = useMemo(
    () => ({ tasks, status, error, reload, addTask, deleteTask, moveTask }),
    [tasks, status, error, reload, addTask, deleteTask, moveTask],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
