import React, { useState } from "react";
import Column from "../components/Column";
import TaskForm from "../components/TaskForm";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import { initialTasks } from "../data/mockTasks";
import { filterTasks } from "../utils/filterTasks";

const BoardPage = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [filteredTasks, setFilteredTasks] = useState(initialTasks);

    const getTasksByStatus = (status) => {
        return filteredTasks.filter((task) => task.status === status);
    };

    const handleAddTask = (newTask) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setFilteredTasks((prevTasks) => [...prevTasks, newTask]); // keep filters updated
    };

    const handleFilter = (filters) => {
        const result = filterTasks(tasks, filters);
        setFilteredTasks(result);
    };

    const assignees = [...new Set(tasks.map((t) => t.assignee))];

    return (
        <div style={{ padding: "20px" }}>
            <TaskForm onAddTask={handleAddTask} />
            <FilterBar onFilter={handleFilter} assignees={assignees} />

            {filteredTasks.length === 0 ? (
                <EmptyState message="No tasks found. Try adjusting filters." />
            ) : (
                <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                    <Column title="To Do" tasks={getTasksByStatus("To Do")} />
                    <Column title="In Progress" tasks={getTasksByStatus("In Progress")} />
                    <Column title="Done" tasks={getTasksByStatus("Done")} />
                </div>
            )}
        </div>
    );
};

export default BoardPage;
