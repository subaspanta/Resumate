import { Router } from "express";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { AuthRepository } from "./auth.repository.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post(
  "/register",
  validateRequest(registerUserSchema),
  authController.register,
);

router.post("/login", validateRequest(loginUserSchema), authController.login);

router.post("/refresh", authController.refresh);

router.get("/me", requireAuth, authController.me);
router.post("/logout", requireAuth, authController.logout);
export default router;
