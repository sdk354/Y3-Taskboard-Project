import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { USERS } from "../data/users";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

const VIEWS = [
  { key: "all", label: "All" },
  { key: "bugs", label: "Bugs" },
  { key: "mine", label: "Mine" },
];

const TopBar = ({ onNewTask }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <span className="logo">bugboard</span>

      <div className="topbar-center">
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
              onClick={() =>
                setParam("view", v.key === "all" ? "" : v.key)
              }
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="topbar-right">
        <div className="avatars" aria-hidden="true">
          {USERS.map((u) => (
            <span
              key={u}
              className={`avatar avatar-${u.toLowerCase()}`}
            >
              {u}
            </span>
          ))}
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            theme === "light"
              ? "Switch to dark mode"
              : "Switch to light mode"
          }
        >
          {theme === "light" ? (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          ) : (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
            </svg>
          )}
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

        <button
          className="new-task-btn"
          onClick={onNewTask}
        >
          + new task
        </button>
      </div>
    </header>
  );
};

export default TopBar;