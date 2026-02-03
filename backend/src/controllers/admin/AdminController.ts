import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IAdminService } from "../../types/services/admin/IAdminService";
import { AdminRequest } from "../../types/AdminRequest";

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.AdminService)
    private readonly adminService: IAdminService
  ) {}

  async getDashboard(req: AdminRequest, res: Response): Promise<Response> {
    // ✅ NOW THIS EXISTS
    const adminId = req.admin.id;

    const data = await this.adminService.getDashboard(adminId);

    return res.status(200).json({
      success: true,
      data,
    });
  }
}
