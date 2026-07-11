import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { env } from "../../config/env.js";
import { SafeUser } from "./auth.types.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";

const AUTH_COOKIE_PATH = "/api/v1/auth";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}
  cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: env.COOKIE_MAX_AGE,
  };
  refreshCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: env.REFRESH_COOKIE_MAX_AGE,
    path: AUTH_COOKIE_PATH,
  };
  private sendAuthresponse(
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
      const { user, accessToken, refreshToken } = await this.authService.register(
        req.body,
      );
      this.sendAuthresponse(res, user, accessToken, refreshToken, 201);
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken, refreshToken } = await this.authService.login(
        req.body,
      );
      this.sendAuthresponse(res, user, accessToken, refreshToken, 200);
    } catch (error) {
      next(error);
    }
  };
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;
      if (typeof token !== "string" || token.length === 0) {
        throw new AppError(
          401,
          ERROR_CODES.REFRESH_TOKEN_INVALID,
          "Refresh token is missing",
        );
      }

      const { user, accessToken, refreshToken } =
        await this.authService.refresh(token);
      this.sendAuthresponse(res, user, accessToken, refreshToken, 200);
    } catch (error) {
      next(error);
    }
  };
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout(req.cookies.refreshToken);

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict" as const,
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: AUTH_COOKIE_PATH,
      });

      res.status(200).json({
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
      res.status(200).json({
        success: true,
        data: currentUser,
      });
    } catch (error) {
      next(error);
    }
  };
}
