import React from "react";
import { Link } from "react-router-dom";

function NotFound({
  title = "404 - Page Not Found",
  message = "The page you are looking for does not exist.",
}) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>{title}</h2>
      <p>{message}</p>
      <Link to="/">Back to Board</Link>
    </div>
  );
}

export default NotFound;
