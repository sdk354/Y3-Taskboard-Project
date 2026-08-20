const tasks = [
  { 
    id: 'BUG-101', 
    type: 'BUG', 
    priority: 'CRITICAL', 
    title: 'Login accepts expired session token', 
    assigneeInitials: 'SD', 
    dueDate: '2026-08-12',
    category: 'auth',
    status: 'To Do' 
  },
  { 
    id: 'TASK-110', 
    type: 'TASK', 
    priority: 'TASK', 
    title: 'Set up Express project skeleton', 
    assigneeInitials: 'RV', 
    dueDate: '2026-08-09',
    category: 'backend',
    status: 'In Progress' 
  },
  { 
    id: 'BUG-102', 
    type: 'BUG', 
    priority: 'MAJOR', 
    title: 'Delete confirm shows the wrong task title', 
    assigneeInitials: 'SD', 
    dueDate: '2026-08-13',
    category: 'board',
    status: 'In Review' 
  },
  { 
    id: 'TASK-101', 
    type: 'TASK', 
    priority: 'TASK', 
    title: 'Vite scaffold and repo setup', 
    assigneeInitials: 'SD', 
    closedDate: '2026-08-03',
    category: 'setup',
    status: 'Done' 
  }
];

export default tasks;