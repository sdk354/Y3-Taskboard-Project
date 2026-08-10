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

  return (
    <div style={{ padding: "20px" }}>
      <TaskForm onAddTask={handleAddTask} />

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {STATUSES.map((status) => (
          <Column
            key={status}
            title={status}
            tasks={getTasksByStatus(status)}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardPage;
