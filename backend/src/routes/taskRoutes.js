import express from "express";
import taskController from "../controllers/taskController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTask);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;