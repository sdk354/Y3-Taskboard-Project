import React from "react";
import { useSearchParams } from "react-router-dom";
import { USERS } from "../data/users";
import { useTheme } from "../hooks/useTheme";

const VIEWS = [
  { key: "all", label: "All" },
  { key: "bugs", label: "Bugs" },
  { key: "mine", label: "Mine" },
];

const TopBar = ({ onNewTask }) => {
  const { theme, toggleTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "all";

  const setParam = (key, value) => {
    const next = Object.fromEntries(searchParams);
    if (value) {
      next[key] = value;
    } else {
      delete next[key];
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <header className="topbar">
      <span className="logo">bugboard</span>

      <input
        type="search"
        className="board-search"
        placeholder="Search the board..."
        aria-label="Search the board"
        value={searchParams.get("q") || ""}
        onChange={(e) => setParam("q", e.target.value)}
      />

      <div className="view-pills" role="group" aria-label="Filter view">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            className={view === v.key ? "pill pill-active" : "pill"}
            onClick={() => setParam("view", v.key === "all" ? "" : v.key)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="avatars" aria-hidden="true">
        {USERS.map((u) => (
          <span key={u} className={`avatar avatar-${u.toLowerCase()}`}>
            {u}
          </span>
        ))}
      </div>

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={
          theme === "light" ? "Switch to dark mode" : "Switch to light mode"
        }
      >
        ◐
      </button>

      <button className="new-task-btn" onClick={onNewTask}>
        + new task
      </button>
    </header>
  );
};

export default TopBar;
