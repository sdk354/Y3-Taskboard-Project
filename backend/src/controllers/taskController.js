import taskRepository from "../repositories/taskRepository.js";

const taskController = {
  getAllTasks: (req, res) => {
    try {
      const tasks = taskRepository.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Server error retrieving tasks" });
    }
  },

  createTask: (req, res) => {
    try {
      const { title, type } = req.body;

      if (!title || title.trim().length < 3) {
        return res.status(400).json({ 
          message: "Validation Error: Title is required and must be at least 3 characters long." 
        });
      }
      if (!type || !["BUG", "TASK"].includes(type)) {
        return res.status(400).json({ 
          message: "Validation Error: Type is required and must be either BUG or TASK." 
        });
      }

      const newTask = taskRepository.createTask(req.body);
      res.status(201).json(newTask);

    } catch (error) {
      res.status(500).json({ message: "Server error creating task" });
    }
  }
};

export default taskController;