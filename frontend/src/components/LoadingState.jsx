import React from "react";

const LoadingState = () => {
  return (
    <div className="board-state" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>Loading the board...</p>
    </div>
  );
};

export default LoadingState;
