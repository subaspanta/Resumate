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

  // Lax: allows OAuth return navigation, blocks cross-site POST/XHR CSRF
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

  // Short-lived OAuth nonce, path-scoped to auth routes
  private oauthStateCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 10 * 60 * 1000,
    path: AUTH_COOKIE_PATH,
  };

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
      const { code, state } = req.query as { code: string; state: string };
      const expectedState = req.cookies.oauthState;

      // Verify state cookie matches query param
      if (!expectedState || state !== expectedState) {
        throw new AppError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.OAUTH_STATE_INVALID,
          "Sign-in request could not be verified. Please try again.",
        );
      }

      // Clear nonce with matching options (path matters)
      res.clearCookie("oauthState", this.oauthStateCookieOptions);

      const { accessToken, refreshToken } =
        await this.authService.loginWithGoogle(code);

      this.setAuthCookies(res, accessToken, refreshToken);

      // Redirect browser, not JSON response
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
