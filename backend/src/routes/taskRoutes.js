import express from "express";
import taskController from "../controllers/taskController.js";

const router = express.Router();

router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTask);

export default router;