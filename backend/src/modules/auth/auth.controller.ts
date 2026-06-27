import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { env } from "../../config/env.js";
import { SafeUser } from "./auth.types.js";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}
  cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: env.COOKIE_MAX_AGE,
  };
  private sendAuthresponse(
    res: Response,
    user: SafeUser,
    accessToken: string,
    statusCode: number,
  ) {
    res.cookie("accessToken", accessToken, this.cookieOptions);
    res.status(statusCode).json({
      success: true,
      data: user,
    });
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken } = await this.authService.register(req.body);
      this.sendAuthresponse(res, user, accessToken, 201);
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken } = await this.authService.login(req.body);
      this.sendAuthresponse(res, user, accessToken, 200);
    } catch (error) {
      next(error);
    }
  };
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict" as const,
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
