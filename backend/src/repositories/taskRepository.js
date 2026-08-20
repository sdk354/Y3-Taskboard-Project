import tasks from '../utils/mockTasks.js';

const nextIdFor = (prefix) => {
  const highest = tasks
    .filter((task) => task.id.startsWith(`${prefix}-`))
    .map((task) => Number(task.id.split('-')[1]))
    .filter((n) => !Number.isNaN(n))
    .reduce((max, n) => Math.max(max, n), 0);
  return `${prefix}-${highest + 1}`;
};

const taskRepository = {
  getAllTasks: () => tasks,
  getTaskById: (id) => tasks.find(task => task.id === id),
  createTask: (taskData) => {
    const prefix = taskData.type === 'BUG' ? 'BUG' : 'TASK';
    const newTask = {
        id: nextIdFor(prefix),
        ...taskData,
        status: taskData.status || 'To Do'
    };
    tasks.push(newTask);
    return newTask;
  }
};

export default taskRepository;