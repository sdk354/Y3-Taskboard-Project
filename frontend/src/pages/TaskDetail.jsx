import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import NotFound from "./NotFound";

function TaskDetail() {
  const { id } = useParams();
  const { tasks } = useTasks();

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <NotFound title="Task Not Found" message="No task exists with this id." />
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Task Details</h2>

      <div className="card">
        <h3>{task.title}</h3>

        <p>
          <strong>Assignee:</strong> {task.assignee}
        </p>

        <p>
          <strong>Status:</strong> {task.status}
        </p>

        <p>
          <strong>Due Date:</strong> {task.dueDate}
        </p>
      </div>

      <br />

      <Link to="/">Back to Board</Link>
    </div>
  );
}

export default TaskDetail;
