import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { env } from "../../config/env.js";
import { SafeUser } from "./auth.types.js";
import { HTTP_STATUS } from "../../constants/http-status.js";

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
  private sendAuthResponse(
    res: Response,
    user: SafeUser,
    accessToken: string,
    refreshToken: string,
    statusCode: number,
  ) {
    res.cookie("accessToken", accessToken, this.cookieOptions);
    res.cookie("refreshToken", refreshToken, this.refreshCookieOptions);
    res.status(statusCode).json({
      success: true,
      data: user,
    });
  }

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
      this.sendAuthResponse(res, user, accessToken, refreshToken, 200);
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
        message: "Logged out successfully",
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
        message: "Account deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
