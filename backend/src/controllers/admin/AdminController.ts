import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { UnauthorizedError } from "../../shared/errors/errors";
import { IAdminService } from "../../types/services/admin/IAdminService";
import { AuthRequest } from "../../types/services/user/AuthRequest";

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.AdminService)
    private readonly _adminService: IAdminService,
  ) {}

  async getDashboard(req: AuthRequest, res: Response): Promise<Response> {
    if (!req.admin) {
      throw new UnauthorizedError("Admin not authenticated");
    }

    const data = await this._adminService.getDashboard(req.admin.id);

    return res.status(200).json({
      success: true,
      data,
    });
  }
}