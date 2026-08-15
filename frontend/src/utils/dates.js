import { STATUS } from "../data/statuses";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// "2026-08-12" -> "12 Aug"
export function formatShortDate(isoDate) {
  if (!isoDate) return "";
  const [, month, day] = isoDate.split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]}`;
}

// local date as yyyy-mm-dd, string compare works fine for iso dates
export function todayString() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

export function isOverdue(task) {
  return (
    Boolean(task.dueDate) &&
    task.dueDate < todayString() &&
    task.status !== STATUS.DONE
  );
}
