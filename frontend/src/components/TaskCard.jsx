import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { STATUS, STATUSES } from "../data/statuses";
import { formatShortDate, isOverdue } from "../utils/dates";
import { noteClass, typeChip } from "../utils/noteStyle";
import { useTouchDrag } from "../hooks/useTouchDrag";
import { useSwipeActions } from "../hooks/useSwipeActions";

const initials = (name = "?") =>
  name.length <= 2
    ? name.toUpperCase()
    : name
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

const TaskCard = ({ task, onDeleteTask = () => {}, onMoveTask = () => {} }) => {
  const done = task.status === STATUS.DONE;
  const overdue = isOverdue(task);
  const chip = typeChip(task);
  const [sheetOpen, setSheetOpen] = useState(false);

  const noteRef = useRef(null);
  useTouchDrag(noteRef, (status) => onMoveTask(task.id, status));

  const nextStatus = STATUSES[STATUSES.indexOf(task.status) + 1];
  useSwipeActions(noteRef, {
    onSwipeRight: nextStatus ? () => onMoveTask(task.id, nextStatus) : null,
    onSwipeLeft: () => onDeleteTask(task.id),
  });

  // no confirm dialog, the undo toast covers mistakes
  const handleDelete = () => onDeleteTask(task.id);

  return (
    <>
      <div
        ref={noteRef}
        className={`task-note ${noteClass(task)}`}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", task.id);
          e.dataTransfer.effectAllowed = "move";
        }}
      >
        {done && (
          <span className="note-check" aria-hidden="true">
            ✓
          </span>
        )}

        <div className="note-chips">
          <span className="chip chip-key">{task.key || task.id}</span>
          <span className={`chip ${chip.className}`}>{chip.label}</span>
          <button
            className="note-more"
            aria-label={`Actions for ${task.title}`}
            onClick={() => setSheetOpen(true)}
          >
            ⋯
          </button>
        </div>

        <h4 className="note-title">
          <Link to={`/tasks/${task.id}`}>{task.title}</Link>
        </h4>

        <div className="note-meta">
          <span
            className={`avatar avatar-${initials(task.assignee).toLowerCase()}`}
            title={task.assignee}
          >
            {initials(task.assignee)}
          </span>
          <span className={overdue ? "note-due overdue" : "note-due"}>
            {done
              ? `closed ${formatShortDate(task.dueDate)}`
              : `due ${formatShortDate(task.dueDate)}`}
            {overdue && " !"}
          </span>
          {task.tag && <span className="note-tag">#{task.tag}</span>}
        </div>

        <div className="note-actions">
          {STATUSES.filter((status) => status !== task.status).map((status) => (
            <button
              key={status}
              onClick={() => onMoveTask(task.id, status)}
              aria-label={`Move ${task.title} to ${status}`}
            >
              → {status}
            </button>
          ))}

          <button onClick={handleDelete} aria-label={`Delete ${task.title}`}>
            Delete
          </button>
        </div>
      </div>

      {sheetOpen && (
        <>
          <div className="sheet-backdrop" onClick={() => setSheetOpen(false)} />
          <div className="card-sheet" role="menu">
            <p className="sheet-title">{task.title}</p>
            {STATUSES.filter((s) => s !== task.status).map((s) => (
              <button
                key={s}
                className="sheet-option"
                onClick={() => {
                  onMoveTask(task.id, s);
                  setSheetOpen(false);
                }}
              >
                Move to {s}
              </button>
            ))}
            <Link className="sheet-option" to={`/tasks/${task.id}`}>
              Open / Edit
            </Link>
            <button
              className="sheet-option danger"
              onClick={() => {
                setSheetOpen(false);
                handleDelete();
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default TaskCard;
