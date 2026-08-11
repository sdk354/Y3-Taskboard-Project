import React, { useState } from "react";
import Column from "../components/Column";
import TaskForm from "../components/TaskForm";
import { initialTasks } from "../data/mockTasks";
import { STATUSES } from "../data/statuses";

const BoardPage = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  // Function to handle adding the new task
  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Handlers for deleting and moving tasks
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleMoveTask = (taskId, newStatus) => {
    // Ignore anything that isn't a known status so a bad caller
    // can't strand a task outside every column
    if (!STATUSES.includes(newStatus)) return;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <TaskForm onAddTask={handleAddTask} />

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {STATUSES.map((status) => (
          <Column
            key={status}
            title={status}
            tasks={getTasksByStatus(status)}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardPage;
