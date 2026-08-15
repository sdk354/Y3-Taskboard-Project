import { STATUS } from "../data/statuses";

// note colour + chip for a task, shared by the board card and detail page
export const noteClass = (task) => {
  if (task.status === STATUS.DONE) return "note-green";
  if (task.type === "bug") {
    return task.severity === "minor" ? "note-yellow" : "note-pink";
  }
  return "note-blue";
};

export const typeChip = (task) => {
  if (task.type !== "bug") return { label: "TASK", className: "chip-task" };
  if (task.status === STATUS.DONE)
    return { label: "FIXED", className: "chip-fixed" };
  return {
    label: (task.severity || "bug").toUpperCase(),
    className: `chip-${task.severity || "major"}`,
  };
};
