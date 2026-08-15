import React from "react";

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="board-state" role="alert">
      <p>{message || "Something went wrong loading the board."}</p>
      <button className="retry-btn" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
};

export default ErrorState;
