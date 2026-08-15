import React from "react";
import { useSearchParams } from "react-router-dom";
import { STATUSES } from "../data/statuses";
import styles from "./FilterBar.module.css";

const FilterBar = ({ assignees }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // replace instead of push so typing doesn't fill up the history stack
  const handleChange = (key, value) => {
    const next = Object.fromEntries(searchParams);
    if (value) {
      next[key] = value;
    } else {
      delete next[key];
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <div className={styles.filterBar}>
      <input
        type="text"
        placeholder="Search tasks..."
        aria-label="Search tasks"
        value={searchParams.get("q") || ""}
        onChange={(e) => handleChange("q", e.target.value)}
        className={styles.searchInput}
      />
      <select
        aria-label="Filter by status"
        value={searchParams.get("status") || ""}
        onChange={(e) => handleChange("status", e.target.value)}
        className={styles.selectDropdown}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by assignee"
        value={searchParams.get("assignee") || ""}
        onChange={(e) => handleChange("assignee", e.target.value)}
        className={styles.selectDropdown}
      >
        <option value="">All Assignees</option>
        {assignees.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
