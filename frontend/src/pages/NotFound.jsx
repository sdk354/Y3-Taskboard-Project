import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Back to Board</Link>
    </div>
  );
}

export default NotFound;