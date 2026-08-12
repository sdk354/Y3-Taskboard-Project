import React, { createContext, useContext, useState } from "react";
import { initialTasks } from "../data/mockTasks";
import { STATUSES } from "../data/statuses";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
  };

  const moveTask = (taskId, newStatus) => {
    if (!STATUSES.includes(newStatus)) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  const getTaskById = (id) => {
    return tasks.find((task) => task.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        moveTask,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};


export const useTasks = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      "useTasks must be used inside TaskProvider"
    );
  }

  return context;
};