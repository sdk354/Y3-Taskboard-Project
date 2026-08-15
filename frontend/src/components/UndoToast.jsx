import React from "react";
import { useTasks } from "../hooks/useTasks";

const UndoToast = () => {
  const { lastDeleted, undoDelete } = useTasks();

  if (!lastDeleted) return null;

  return (
    <div className="toast" role="status">
      <span>Deleted "{lastDeleted.task.title}"</span>
      <button onClick={undoDelete}>Undo</button>
    </div>
  );
};

export default UndoToast;
