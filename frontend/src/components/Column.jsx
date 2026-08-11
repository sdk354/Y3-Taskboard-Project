import React from "react";
import TaskCard from "./TaskCard";

const Column = ({ title, tasks, onDeleteTask, onMoveTask }) => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#f4f5f7",
        padding: "15px",
        borderRadius: "8px",
        minHeight: "500px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
          fontWeight: "bold",
        }}
      >
        <h2>{title}</h2>
        <span>{tasks.length}</span>
      </div>
      <div>
        {tasks.map((task) => (
          <TaskCard 
          key={task.id}
          task={task}
          onDeleteTask={onDeleteTask}
          onMoveTask={onMoveTask}
           />
        ))}
      </div>
    </div>
  );
};

export default Column;
