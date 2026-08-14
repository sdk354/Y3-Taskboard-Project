import React from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./FilterBar.module.css";

const FilterBar = ({ onFilter, assignees }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchParams({ ...Object.fromEntries(searchParams), q: value });
        onFilter({ query: value, status: searchParams.get("status"), assignee: searchParams.get("assignee") });
    };

    const handleStatus = (e) => {
        const value = e.target.value;
        setSearchParams({ ...Object.fromEntries(searchParams), status: value });
        onFilter({ query: searchParams.get("q"), status: value, assignee: searchParams.get("assignee") });
    };

    const handleAssignee = (e) => {
        const value = e.target.value;
        setSearchParams({ ...Object.fromEntries(searchParams), assignee: value });
        onFilter({ query: searchParams.get("q"), status: searchParams.get("status"), assignee: value });
    };

    return (
        <div className={styles.filterBar}>
            <input
                type="text"
                placeholder="Search tasks..."
                value={searchParams.get("q") || ""}
                onChange={handleSearch}
                className={styles.searchInput}
            />
            <select value={searchParams.get("status") || ""} onChange={handleStatus} className={styles.selectDropdown}>
                <option value="">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>
            <select value={searchParams.get("assignee") || ""} onChange={handleAssignee} className={styles.selectDropdown}>
                <option value="">All Assignees</option>
                {assignees.map((a) => (
                    <option key={a} value={a}>{a}</option>
                ))}
            </select>
        </div>
    );
};

export default FilterBar;
