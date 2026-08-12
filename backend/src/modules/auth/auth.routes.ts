import { Router } from "express";
import {
  googleCallbackQuerySchema,
  loginUserSchema,
  registerUserSchema,
} from "./auth.schema.js";
import {
  validateQuery,
  validateRequest,
} from "../../middleware/validate-request.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { oauthRateLimit } from "../../middleware/oauth-rate-limit.js";
import { authController } from "../../container.js";

const router = Router();

router.post(
  "/register",
  validateRequest(registerUserSchema),
  authController.register,
);

router.post("/login", validateRequest(loginUserSchema), authController.login);

router.post("/refresh", authController.refresh);

// Neither route gets requireAuth — there is no session yet, by definition.
// Rate limit runs first so a flood is rejected before any Zod work.
router.get("/google", oauthRateLimit, authController.googleRedirect);
router.get(
  "/google/callback",
  oauthRateLimit,
  validateQuery(googleCallbackQuerySchema),
  authController.googleCallback,
);

router.get("/me", requireAuth, authController.me);
router.post("/logout", requireAuth, authController.logout);
router.delete("/me", requireAuth, authController.deleteAccount);
export default router;
