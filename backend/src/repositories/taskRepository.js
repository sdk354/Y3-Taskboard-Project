const tasks = require('../utils/mockTasks');
let keyCounter = 102; 

module.exports = {
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