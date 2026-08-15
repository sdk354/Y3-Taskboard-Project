import React from "react";

const EmptyState = ({ message }) => {
  return (
    <div className="board-state">
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
