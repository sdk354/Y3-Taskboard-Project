import taskRepository from "../repositories/taskRepository.js";

const allowedStatuses = [
  "To Do",
  "In Progress",
  "In Review",
  "Done",
];

const taskController = {
  getAllTasks: (req, res) => {
    try {
      res.status(200).json(taskRepository.getAllTasks());
    } catch {
      res.status(500).json({
        message: "Server error retrieving tasks",
      });
    }
  },

  createTask: (req, res) => {
    try {
      const { title, type } = req.body;

      if (!title || title.trim().length < 3) {
        return res.status(400).json({
          message:
            "Title is required and must contain at least 3 characters.",
        });
      }

      if (!type || !["bug", "task"].includes(type)) {
        return res.status(400).json({
          message: "Type must be either bug or task.",
        });
      }

      const task = taskRepository.createTask(req.body);

      res.status(201).json(task);
    } catch {
      res.status(500).json({
        message: "Server error creating task",
      });
    }
  },

  updateTask: (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (
        updates.status &&
        !allowedStatuses.includes(updates.status)
      ) {
        return res.status(400).json({
          message: "Invalid task status.",
        });
      }

      if (
        updates.title &&
        updates.title.trim().length < 3
      ) {
        return res.status(400).json({
          message:
            "Title must contain at least 3 characters.",
        });
      }

      const updatedTask = taskRepository.updateTask(id, updates);

      if (!updatedTask) {
        return res.status(404).json({
          message: "Task not found.",
        });
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error updating task",
      });
    }
  },

  deleteTask: (req, res) => {
    try {
      const deletedTask = taskRepository.deleteTask(req.params.id);

      if (!deletedTask) {
        return res.status(404).json({
          message: "Task not found.",
        });
      }

      res.status(200).json({
        message: "Task deleted successfully.",
        task: deletedTask,
      });
    } catch {
      res.status(500).json({
        message: "Server error deleting task",
      });
    }
  },
};

export default taskController;