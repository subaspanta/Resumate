import { Router } from "express";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { authController } from "../../container.js";

const router = Router();

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
