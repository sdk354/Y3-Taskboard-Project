import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '15px', margin: '10px 0', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>{task.title}</h4>
      <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Assignee:</strong> {task.assignee}</p>
      <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Due:</strong> {task.dueDate}</p>
    </div>
  );
};

export default TaskCard;