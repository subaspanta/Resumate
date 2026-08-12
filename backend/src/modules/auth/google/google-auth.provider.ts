import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../../types/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import { HTTP_STATUS } from "../../../constants/http-status.js";
import { env } from "../../../config/env.js";
import { classifyGoogleAuthError } from "./google-auth-error.js";
import { GoogleAuthProvider, GoogleProfile } from "./google-auth.types.js";

// `openid` must lead the list — it is what makes this an OpenID Connect
// request and therefore what makes Google return an id_token at all. `email`
// yields the email and email_verified claims; `profile` yields name.
const GOOGLE_SCOPES = ["openid", "email", "profile"];

export class GoogleOAuthProvider implements GoogleAuthProvider {
  // Takes the client rather than building one, for the same reason the agents
  // take GoogleGenAI: a provider that constructs its own SDK client cannot be
  // faked in a test without mocking the entire module.
  constructor(private readonly client: OAuth2Client) {}

  buildAuthUrl(state: string): string {
    return this.client.generateAuthUrl({
      // "online": we never need to call Google on the user's behalf later, so
      // asking for a refresh token would be requesting a long-lived credential
      // we have no use for. Session lifetime is our own refresh-token
      // rotation, not Google's.
      access_type: "online",
      scope: GOOGLE_SCOPES,
      state,
      // Always show the account chooser. Without it a user signed into several
      // Google accounts is silently bound to whichever one Google picks.
      prompt: "select_account",
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

      // The trust anchor of this whole flow. verifyIdToken checks Google's
      // signature against its published keys and that `aud` equals our client
      // id — without it, the claims below are just attacker-supplied JSON.
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
        // Strict true. The claim is optional and may be absent or a string;
        // anything other than boolean true must not count as verified.
        emailVerified: payload.email_verified === true,
        // `profile` scope grants name but Google documents it as not
        // guaranteed, so fall back to the local part of the address.
        name: payload.name ?? payload.email.split("@")[0],
      };
    } catch (err) {
      throw classifyGoogleAuthError(err);
    }
  }
}
