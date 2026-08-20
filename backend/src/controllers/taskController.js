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
  },

  updateTask: (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedStatuses = ["To Do", "In Progress", "Done"];

    if (updates.status && !allowedStatuses.includes(updates.status)) {
      return res.status(400).json({
        message: "Validation Error: Invalid task status."
      });
    }

    if (updates.title && updates.title.trim().length < 3) {
      return res.status(400).json({
        message: "Validation Error: Title must be at least 3 characters long."
      });
    }

    const updatedTask = taskRepository.updateTask(id, updates);

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found."
      });
    }

    res.status(200).json(updatedTask);

  } catch (error) {
    res.status(500).json({
      message: "Server error updating task"
    });
  }
},

deleteTask: (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = taskRepository.deleteTask(id);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found."
      });
    }

    res.status(200).json({
      message: "Task deleted successfully.",
      task: deletedTask
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error deleting task"
    });
  }
}
};

export default taskController;