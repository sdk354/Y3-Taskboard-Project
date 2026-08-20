import express from "express";

import taskController from "../controllers/taskController.js";

const router = express.Router();

router.get("/", taskController.getAllTasks);

router.post("/", taskController.createTask);

router.patch("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

export default router;