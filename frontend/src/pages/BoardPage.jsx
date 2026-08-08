import React, { useState } from 'react';
import Column from '../components/Column';
import { initialTasks } from '../data/mockTasks';

const BoardPage = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', alignItems: 'flex-start' }}>
      <Column title="To Do" tasks={getTasksByStatus('To Do')} />
      <Column title="In Progress" tasks={getTasksByStatus('In Progress')} />
      <Column title="Done" tasks={getTasksByStatus('Done')} />
    </div>
  );
};

export default BoardPage;