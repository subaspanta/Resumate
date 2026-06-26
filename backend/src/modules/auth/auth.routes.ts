import { Router } from "express";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { AuthController } from "./auth.controller.js";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validateRequest(registerUserSchema),
  authController.register,
);

router.post("/login", validateRequest(loginUserSchema), authController.login);

export default router;
