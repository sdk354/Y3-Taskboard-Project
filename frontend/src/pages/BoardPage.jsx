import React, { useState } from 'react';
import Column from '../components/Column';
import TaskForm from '../components/TaskForm'; 
import { initialTasks } from '../data/mockTasks';

const BoardPage = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Function to handle adding the new task
  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <TaskForm onAddTask={handleAddTask} />

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <Column title="To Do" tasks={getTasksByStatus('To Do')} />
        <Column title="In Progress" tasks={getTasksByStatus('In Progress')} />
        <Column title="Done" tasks={getTasksByStatus('Done')} />
      </div>
    </div>
  );
};

export default BoardPage;