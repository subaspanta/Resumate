import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../../types/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import { HTTP_STATUS } from "../../../constants/http-status.js";
import { env } from "../../../config/env.js";
import { Logger } from "../../../config/logger.js";
import { classifyGoogleAuthError } from "./google-auth-error.js";
import { GoogleAuthProvider, GoogleProfile } from "./google-auth.types.js";

// `openid` must be first to receive an id_token; `email` and `profile` provide user data
const GOOGLE_SCOPES = ["openid", "email", "profile"];

export class GoogleOAuthProvider implements GoogleAuthProvider {
  // Injected client for testability
  constructor(
    private readonly client: OAuth2Client,
    private readonly logger: Logger,
  ) {}

  buildAuthUrl(state: string): string {
    return this.client.generateAuthUrl({
      access_type: "online", // No refresh token needed for one-time auth
      scope: GOOGLE_SCOPES,
      state,
      prompt: "select_account", // Always show account chooser
    });
  }

  async exchangeCodeForProfile(code: string): Promise<GoogleProfile> {
    try {
      const { tokens } = await this.client.getToken(code);

      if (!tokens.id_token) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.OAUTH_EXCHANGE_FAILED,
          "Could not complete Google sign-in. Please try again.",
        );
      }

      // Verify signature and audience; prevents forged tokens
      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload?.sub || !payload.email) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.OAUTH_EXCHANGE_FAILED,
          "Google did not return enough profile information to sign you in.",
        );
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified === true, // Strict boolean check
        name: payload.name ?? payload.email.split("@")[0], // Fallback to email local part
      };
    } catch (err) {
      throw classifyGoogleAuthError(err, this.logger);
    }
  }
}
