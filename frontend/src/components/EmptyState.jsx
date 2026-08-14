import React from "react";

const EmptyState = ({ message }) => {
    return (
        <div style={{ padding: "20px", textAlign: "center", color: "var(--text)" }}>
            <p>{message}</p>
        </div>
    );
};

export default EmptyState;
