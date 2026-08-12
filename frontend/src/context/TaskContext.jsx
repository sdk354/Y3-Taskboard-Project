import React, { useCallback, useEffect, useMemo, useState } from "react";
import { initialTasks } from "../data/mockTasks";
import { STATUSES } from "../data/statuses";
import { TaskContext } from "../hooks/useTasks";

const STORAGE_KEY = "taskboard-tasks";

const loadTasks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialTasks;
  } catch {
    return initialTasks;
  }
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(loadTasks);

  // Persist tasks so /tasks/:id links to user-created tasks
  // survive a page refresh (state used to live only in memory)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  const moveTask = useCallback((taskId, newStatus) => {
    // Ignore anything that isn't a known status so a bad caller
    // can't strand a task outside every column
    if (!STATUSES.includes(newStatus)) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ tasks, addTask, deleteTask, moveTask }),
    [tasks, addTask, deleteTask, moveTask],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
