import { STATUS } from "./statuses";

export const initialTasks = [
  {
    id: "1",
    title: "Set up React Vite project",
    assignee: "Alice",
    status: STATUS.DONE,
    dueDate: "2026-08-01",
  },
  {
    id: "2",
    title: "Create mock data array",
    assignee: "Bob",
    status: STATUS.DONE,
    dueDate: "2026-08-06",
  },
  {
    id: "3",
    title: "Build board layout",
    assignee: "Alice",
    status: STATUS.IN_PROGRESS,
    dueDate: "2026-08-07",
  },
  {
    id: "4",
    title: "Design Task Cards",
    assignee: "Charlie",
    status: STATUS.TODO,
    dueDate: "2026-08-08",
  },
  {
    id: "5",
    title: "Implement Create Form",
    assignee: "Bob",
    status: STATUS.TODO,
    dueDate: "2026-08-09",
  },
  {
    id: "6",
    title: "Add Delete functionality",
    assignee: "Alice",
    status: STATUS.TODO,
    dueDate: "2026-08-10",
  },
  {
    id: "7",
    title: "Add Move functionality",
    assignee: "Charlie",
    status: STATUS.TODO,
    dueDate: "2026-08-11",
  },
  {
    id: "8",
    title: "Configure React Router",
    assignee: "Bob",
    status: STATUS.TODO,
    dueDate: "2026-08-12",
  },
  {
    id: "9",
    title: "Implement Search/Filter",
    assignee: "Alice",
    status: STATUS.TODO,
    dueDate: "2026-08-13",
  },
];
