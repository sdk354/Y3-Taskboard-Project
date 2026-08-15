import React from "react";
import { useSearchParams } from "react-router-dom";
import { STATUSES } from "../data/statuses";

const FilterBar = ({ assignees }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // replace so filter changes don't spam browser history
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
    <div className="filter-row">
      <select
        className="filter-select"
        aria-label="Filter by status"
        value={searchParams.get("status") || ""}
        onChange={(e) => handleChange("status", e.target.value)}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <select
        className="filter-select"
        aria-label="Filter by assignee"
        value={searchParams.get("assignee") || ""}
        onChange={(e) => handleChange("assignee", e.target.value)}
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
