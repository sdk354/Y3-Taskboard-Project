import React from "react";
import { Link } from "react-router-dom";

function NotFound({
  title = "404 - Page Not Found",
  message = "The page you are looking for does not exist.",
}) {
  return (
    <div className="auth-page">
      <div className="card auth-card">
        <span className="logo">bugboard</span>
        <h2>{title}</h2>
        <p>{message}</p>
        <Link to="/" className="new-task-btn">
          Back to Board
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
