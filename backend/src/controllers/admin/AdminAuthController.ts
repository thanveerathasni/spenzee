import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IAdminAuthService } from "../../types/services/admin/IAdminAuthService";

@injectable()
export class AdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService)
    private readonly adminAuthService: IAdminAuthService,
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const result = await this.adminAuthService.login(email, password);

    res.status(200).json({
      success: true,
      data: result,
    });
  };
}
