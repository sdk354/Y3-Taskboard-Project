import tasks from '../utils/mockTasks.js';

let keyCounter = 102; 

const taskRepository = {
  getAllTasks: () => tasks,
  getTaskById: (id) => tasks.find(task => task.id === id),
  createTask: (taskData) => {
    const prefix = taskData.type === 'BUG' ? 'BUG' : 'TASK';
    const newTask = { 
        id: `${prefix}-${keyCounter++}`, 
        ...taskData,
        status: taskData.status || 'To Do' 
    };
    tasks.push(newTask);
    return newTask;
  }
};

export default taskRepository;