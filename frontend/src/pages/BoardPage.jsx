import React from "react";
import Column from "../components/Column";
import TaskForm from "../components/TaskForm";
import { useTasks } from "../context/TaskContext";
import { STATUSES } from "../data/statuses";

const BoardPage = () => {
  const {
    tasks,
    addTask,
    deleteTask,
    moveTask
  } = useTasks();

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div style={{ padding: "20px" }}>
      <TaskForm onAddTask={addTask} />

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {STATUSES.map((status) => (
          <Column
            key={status}
            title={status}
            tasks={getTasksByStatus(status)}
            onDeleteTask={deleteTask}
            onMoveTask={moveTask}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardPage;
