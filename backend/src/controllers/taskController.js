import taskRepository from "../repositories/taskRepository.js";

const allowedStatuses = [
  "To Do",
  "In Progress",
  "In Review",
  "Done",
];

const taskController = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await taskRepository.getAllTasks();

      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error retrieving tasks",
      });
    }
  },

  createTask: async (req, res) => {
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

      if (!req.body.dueDate) {
        return res.status(400).json({
          message: "Due date is required.",
        });
      }

      const task = await taskRepository.createTask(req.body);

      res.status(201).json(task);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error creating task",
      });
    }
  },

  updateTask: async (req, res) => {
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

      const updatedTask = await taskRepository.updateTask(
        id,
        updates,
      );

      if (!updatedTask) {
        return res.status(404).json({
          message: "Task not found.",
        });
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error(error);

      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid task ID.",
        });
      }

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: error.message,
        });
      }

      if (error.status) {
        return res.status(error.status).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Server error updating task",
      });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const deletedTask = await taskRepository.deleteTask(
        req.params.id,
      );

      if (!deletedTask) {
        return res.status(404).json({
          message: "Task not found.",
        });
      }

      res.status(200).json({
        message: "Task deleted successfully.",
        task: deletedTask,
      });
    } catch (error) {
      console.error(error);

      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid task ID.",
        });
      }

      res.status(500).json({
        message: "Server error deleting task",
      });
    }
  },
};

export default taskController;