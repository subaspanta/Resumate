import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { env } from "../../config/env.js";
import { SafeUser } from "./auth.types.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { AppError } from "../../types/app-error.js";

const AUTH_COOKIE_PATH = "/api/v1/auth";

export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // "lax", not "strict": the Google OAuth callback is reached by a cross-site
  // top-level navigation from accounts.google.com, and browsers do not carry
  // strict cookies across one — sign-in would appear to succeed and leave the
  // user logged out. Lax still withholds the cookie from cross-site POST/XHR,
  // which is where the CSRF risk actually lives.
  cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: env.COOKIE_MAX_AGE,
  };
  refreshCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: env.REFRESH_COOKIE_MAX_AGE,
    path: AUTH_COOKIE_PATH,
  };
  // Short-lived CSRF nonce for the OAuth round trip. Lax so it survives the
  // return navigation from Google; scoped to the auth path so it never rides
  // along on ordinary API calls.
  private oauthStateCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 10 * 60 * 1000,
    path: AUTH_COOKIE_PATH,
  };

  // Extracted so the OAuth callback can set exactly these cookies without also
  // sending a JSON body — it answers with a redirect instead.
  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie("accessToken", accessToken, this.cookieOptions);
    res.cookie("refreshToken", refreshToken, this.refreshCookieOptions);
  }

  private sendAuthResponse(
    res: Response,
    user: SafeUser,
    accessToken: string,
    refreshToken: string,
    statusCode: number,
  ) {
    this.setAuthCookies(res, accessToken, refreshToken);
    res.status(statusCode).json({
      success: true,
      data: user,
    });
  }

  googleRedirect = (_req: Request, res: Response, next: NextFunction) => {
    try {
      const state = crypto.randomBytes(32).toString("base64url");
      res.cookie("oauthState", state, this.oauthStateCookieOptions);
      res.redirect(this.authService.buildGoogleAuthUrl(state));
    } catch (error) {
      next(error);
    }
  };

  googleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Shape already validated by googleCallbackQuerySchema on the route.
      const { code, state } = req.query as { code: string; state: string };
      const expectedState = req.cookies.oauthState;

      // Verified here rather than in the service because it is a property of
      // this HTTP exchange — a cookie against a query param — not a business
      // rule. The service has access to neither and shouldn't grow a cookie
      // parameter to get it.
      if (!expectedState || state !== expectedState) {
        throw new AppError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.OAUTH_STATE_INVALID,
          "Sign-in request could not be verified. Please try again.",
        );
      }

      // Same options object it was set with, deliberately. Express documents
      // that clients only clear a cookie when clearCookie's options are
      // identical to res.cookie's — a differing Path emits a normal-looking
      // Set-Cookie while the stale nonce survives in the browser, replayable
      // for its full 10-minute life. (maxAge here is ignored by clearCookie.)
      res.clearCookie("oauthState", this.oauthStateCookieOptions);

      const { accessToken, refreshToken } =
        await this.authService.loginWithGoogle(code);

      this.setAuthCookies(res, accessToken, refreshToken);

      // A browser navigation, not a fetch — cookies plus a redirect, never a
      // JSON body.
      res.redirect(env.FRONTEND_URL);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken, refreshToken } =
        await this.authService.register(req.body);
      this.sendAuthResponse(
        res,
        user,
        accessToken,
        refreshToken,
        HTTP_STATUS.CREATED,
      );
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken, refreshToken } = await this.authService.login(
        req.body,
      );
      this.sendAuthResponse(res, user, accessToken, refreshToken, HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  };
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken, refreshToken } =
        await this.authService.refresh(req.cookies.refreshToken);
      this.sendAuthResponse(
        res,
        user,
        accessToken,
        refreshToken,
        HTTP_STATUS.OK,
      );
    } catch (error) {
      next(error);
    }
  };
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout(req.cookies.refreshToken);

      res.clearCookie("accessToken", this.cookieOptions);
      res.clearCookie("refreshToken", this.refreshCookieOptions);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.sub;
      const currentUser = await this.authService.getCurrentUser(userId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: currentUser,
      });
    } catch (error) {
      next(error);
    }
  };
  deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.sub;
      await this.authService.deleteAccount(userId);

      res.clearCookie("accessToken", this.cookieOptions);
      res.clearCookie("refreshToken", this.refreshCookieOptions);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}
