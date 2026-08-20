import tasks from '../utils/mockTasks.js';

const seedCounter = (prefix) =>
  tasks
    .filter((task) => task.id.startsWith(`${prefix}-`))
    .map((task) => Number(task.id.split('-')[1]))
    .filter((n) => !Number.isNaN(n))
    .reduce((max, n) => Math.max(max, n), 0);

const counters = { BUG: seedCounter('BUG'), TASK: seedCounter('TASK') };

const nextIdFor = (prefix) => {
  counters[prefix] = (counters[prefix] || 0) + 1;
  return `${prefix}-${counters[prefix]}`;
};

const taskRepository = {
  getAllTasks: () => tasks,

  getTaskById: (id) => tasks.find(task => task.id === id),

  createTask: (taskData) => {
    const prefix = taskData.type === 'BUG' ? 'BUG' : 'TASK';

    const newTask = {
      ...taskData,
      id: nextIdFor(prefix),
      status: taskData.status || 'To Do'
    };

    tasks.push(newTask);
    return newTask;
  },

  // Update
  updateTask: (id, updates) => {
    const task = tasks.find(task => task.id === id);

    if (!task) {
      return null;
    }

    const { id: _ignoredId, type: _ignoredType, ...safeUpdates } = updates;
    Object.assign(task, safeUpdates);

    return task;
  },

  // Delete
  deleteTask: (id) => {
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
      return null;
    }

    const deletedTask = tasks.splice(index, 1)[0];

    return deletedTask;
  }
};

export default taskRepository;