import { RoleRepository } from "./role.repository.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { RoleDetail, RoleSummary } from "./role.types.js";

// No ownership checks anywhere in this service: roles are global seed data,
// identical for every user. requireAuth still guards the routes, but there is
// no per-row authorization decision to make.
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async listRoles(): Promise<RoleSummary[]> {
    return this.roleRepository.findAll();
  }

  // Throws rather than returning null so an unknown slug can never reach an
  // AI prompt as if it were a real role.
  async getRoleBySlug(slug: string): Promise<RoleDetail> {
    const role = await this.roleRepository.findBySlug(slug);
    if (!role) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Role not found",
      );
    }
    return role;
  }
}
