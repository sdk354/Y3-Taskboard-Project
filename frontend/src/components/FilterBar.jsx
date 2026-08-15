import React from "react";
import { useSearchParams } from "react-router-dom";
import { STATUSES } from "../data/statuses";
import Dropdown from "./Dropdown";

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
      <Dropdown
        label="Filter by status"
        value={searchParams.get("status") || ""}
        options={[
          { value: "", label: "All Statuses" },
          ...STATUSES.map((s) => ({ value: s, label: s })),
        ]}
        onChange={(v) => handleChange("status", v)}
      />
      <Dropdown
        label="Filter by assignee"
        value={searchParams.get("assignee") || ""}
        options={[
          { value: "", label: "All Assignees" },
          ...assignees.map((a) => ({ value: a, label: a })),
        ]}
        onChange={(v) => handleChange("assignee", v)}
      />
    </div>
  );
};

export default FilterBar;
