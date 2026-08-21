import { Router } from "express";
import * as controller from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/authSchema.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.get("/me", authenticate, controller.me);

export default router;
