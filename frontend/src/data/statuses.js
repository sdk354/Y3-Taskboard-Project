// Single source of truth for task statuses — the board columns filter by
// exact string match, so a typo elsewhere would silently drop tasks.
export const STATUS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

export const STATUSES = [
  STATUS.TODO,
  STATUS.IN_PROGRESS,
  STATUS.IN_REVIEW,
  STATUS.DONE,
];
