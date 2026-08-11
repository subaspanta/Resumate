import { Request, Response, NextFunction } from "express";
import { RoleService } from "./role.service.js";
import { HTTP_STATUS } from "../../constants/http-status.js";

export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.roleService.listRoles();
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getBySlug = async (
    req: Request<{ slug: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.roleService.getRoleBySlug(req.params.slug);
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}
