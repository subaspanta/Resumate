import { Router } from "express";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { AuthController } from "./auth.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validateRequest(registerUserSchema),
  authController.register,
);

router.post("/login", validateRequest(loginUserSchema), authController.login);

router.get("/me", requireAuth, authController.me);
router.post("/logout", requireAuth, authController.logout);
export default router;
