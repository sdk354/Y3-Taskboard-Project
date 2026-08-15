import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import NotFound from "./NotFound";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { STATUS, STATUSES } from "../data/statuses";
import { USERS } from "../data/users";
import { formatShortDate, isOverdue } from "../utils/dates";
import { noteClass, typeChip } from "../utils/noteStyle";

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, status, error, reload, updateTask, deleteTask } = useTasks();
  const [draft, setDraft] = useState(null); // null = not editing
  const [formError, setFormError] = useState("");

  // wait for the fetch before deciding the task doesn't exist
  if (status === "loading") return <LoadingState />;
  if (status === "error")
    return <ErrorState message={error} onRetry={reload} />;

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <NotFound title="Task Not Found" message="No task exists with this id." />
    );
  }

  const done = task.status === STATUS.DONE;
  const overdue = isOverdue(task);
  const chip = typeChip(task);

  const startEdit = () => {
    setDraft({
      title: task.title,
      type: task.type || "task",
      severity: task.severity || "major",
      assignee: task.assignee,
      status: task.status,
      dueDate: task.dueDate,
      tag: task.tag || "",
    });
    setFormError("");
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!draft.title || draft.title.trim().length < 3) {
      setFormError("Title must be at least 3 characters.");
      return;
    }
    if (!draft.dueDate) {
      setFormError("Due date is required.");
      return;
    }
    updateTask(task.id, {
      title: draft.title.trim(),
      type: draft.type,
      severity: draft.type === "bug" ? draft.severity : null,
      assignee: draft.assignee || "Unassigned",
      status: draft.status,
      dueDate: draft.dueDate,
      tag: draft.tag.trim() || null,
    });
    setDraft(null);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    navigate("/");
  };

  const set = (key) => (e) => setDraft({ ...draft, [key]: e.target.value });

  return (
    <div className="detail-page">
      <Link className="back-link" to="/">
        ← Back to board
      </Link>

      <div className={`task-note detail-note ${noteClass(task)}`}>
        {done && (
          <span className="note-check" aria-hidden="true">
            ✓
          </span>
        )}

        <div className="note-chips">
          <span className="chip chip-key">{task.key || task.id}</span>
          <span className={`chip ${chip.className}`}>{chip.label}</span>
        </div>

        {draft ? (
          <form onSubmit={saveEdit} className="detail-edit">
            {formError && <p className="form-error">{formError}</p>}

            <input
              className="detail-title-input"
              aria-label="Title"
              value={draft.title}
              onChange={set("title")}
            />

            <div className="detail-edit-row">
              <div className="form-field">
                <label htmlFor="edit-type">Type</label>
                <select
                  id="edit-type"
                  value={draft.type}
                  onChange={set("type")}
                >
                  <option value="task">Task</option>
                  <option value="bug">Bug</option>
                </select>
              </div>

              {draft.type === "bug" && (
                <div className="form-field">
                  <label htmlFor="edit-severity">Severity</label>
                  <select
                    id="edit-severity"
                    value={draft.severity}
                    onChange={set("severity")}
                  >
                    <option value="critical">Critical</option>
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                  </select>
                </div>
              )}

              <div className="form-field">
                <label htmlFor="edit-assignee">Assignee</label>
                <select
                  id="edit-assignee"
                  value={USERS.includes(draft.assignee) ? draft.assignee : ""}
                  onChange={set("assignee")}
                >
                  <option value="">Unassigned</option>
                  {USERS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  value={draft.status}
                  onChange={set("status")}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="edit-due">Due Date</label>
                <input
                  id="edit-due"
                  type="date"
                  value={draft.dueDate}
                  onChange={set("dueDate")}
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-tag">Tag</label>
                <input
                  id="edit-tag"
                  type="text"
                  placeholder="e.g. auth"
                  value={draft.tag}
                  onChange={set("tag")}
                />
              </div>
            </div>

            <div className="detail-actions">
              <button type="submit" className="new-task-btn">
                Save
              </button>
              <button
                type="button"
                className="detail-cancel"
                onClick={() => setDraft(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="detail-note-title">{task.title}</h2>

            <div className="detail-rows">
              <p>
                <strong>Assignee</strong> {task.assignee}
              </p>
              <p>
                <strong>Status</strong> {task.status}
              </p>
              <p className={overdue ? "overdue" : ""}>
                <strong>{done ? "Closed" : "Due"}</strong>{" "}
                {formatShortDate(task.dueDate)}
                {overdue && " !"}
              </p>
              {task.tag && (
                <p>
                  <strong>Tag</strong> #{task.tag}
                </p>
              )}
            </div>

            <div className="detail-actions">
              <button className="new-task-btn" onClick={startEdit}>
                Edit
              </button>
              <button className="detail-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskDetail;
