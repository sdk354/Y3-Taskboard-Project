import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 

    // Validation 1: Title required and >= 3 characters
    if (!title || title.trim().length < 3) {
      setError('Title is required and must be at least 3 characters long.');
      return;
    }

    // Validation 2: Due date not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const selectedDate = new Date(dueDate);

    if (!dueDate || selectedDate < today) {
      setError('Due date is required and cannot be in the past.');
      return;
    }

    // Create the new task object
    const newTask = {
      id: Date.now().toString(), 
      title: title.trim(),
      assignee: assignee.trim() || 'Unassigned',
      dueDate,
      status: 'To Do', 
    };

    // Send the valid task back to the main board
    onAddTask(newTask);

    // Clear the form and any errors
    setTitle('');
    setAssignee('');
    setDueDate('');
    setError('');
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
      <h3 style={{ marginTop: 0 }}>Add a New Task</h3>
      {error && <p style={{ color: 'red', fontSize: '14px', margin: '0 0 10px 0' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>Assignee</label>
          <input type="text" value={assignee} onChange={(e) => setAssignee(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', height: '35px' }}>
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;