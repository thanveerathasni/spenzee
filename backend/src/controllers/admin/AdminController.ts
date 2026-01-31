import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { IAdminService } from "../../types/services/admin/IAdminService";

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.AdminService)
    private readonly _adminService: IAdminService
  ) {}

  async getDashboard(req: Request, res: Response): Promise<void> {
    const data = await this._adminService.getDashboard();

    res.status(200).json({
      success: true,
      data,
    });
  }
}
