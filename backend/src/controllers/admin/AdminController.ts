import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IAdminService } from "../../types/services/admin/IAdminService";
import { UnauthorizedError } from "../../shared/errors/errors";

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.AdminService)
    private readonly adminService: IAdminService
  ) {}

  async getDashboard(req: Request, res: Response): Promise<Response> {
    if (!req.admin) {
      throw new UnauthorizedError("Admin not authenticated");
    }

    const adminId = req.admin.id;

    const data = await this.adminService.getDashboard(adminId);

    return res.status(200).json({
      success: true,
      data,
    });
  }
}