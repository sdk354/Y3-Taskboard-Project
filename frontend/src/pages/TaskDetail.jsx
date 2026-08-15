import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import NotFound from "./NotFound";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

function TaskDetail() {
  const { id } = useParams();
  const { tasks, status, error, reload } = useTasks();

  // wait for the fetch before deciding the task doesn't exist
  if (status === "loading") return <LoadingState />;
  if (status === "error")
    return <ErrorState message={error} onRetry={reload} />;

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <NotFound title="Task Not Found" message="No task exists with this id." />
    );
  }

  return (
    <div className="detail-page">
      <h2 className="page-title">Task Details</h2>

      <div className="card">
        <h3 className="detail-title">{task.title}</h3>

        <p>
          <strong>Type:</strong> {task.type === "bug" ? "Bug" : "Task"}
          {task.severity ? ` (${task.severity})` : ""}
        </p>

        <p>
          <strong>Assignee:</strong> {task.assignee}
        </p>

        <p>
          <strong>Status:</strong> {task.status}
        </p>

        <p>
          <strong>Due Date:</strong> {task.dueDate}
        </p>

        {task.tag && (
          <p>
            <strong>Tag:</strong> #{task.tag}
          </p>
        )}
      </div>

      <br />

      <Link className="back-link" to="/">
        Back to Board
      </Link>
    </div>
  );
}

export default TaskDetail;
