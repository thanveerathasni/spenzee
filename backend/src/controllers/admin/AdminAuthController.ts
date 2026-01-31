


import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";
import { IAdminAuthService } from "../../types/services/admin/IAdminAuthService";

@injectable()
export class AdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService)
    private readonly _adminAuthService: IAdminAuthService
  ) {}

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const result = await this._adminAuthService.login(
      email,
      password
    );

    return res.status(200).json({
      success: true,
      data: result
    });
  }

 async logout(req: Request, res: Response): Promise<Response> {
  const { refreshToken } = req.body;

  await this._adminAuthService.logout(refreshToken);

  return res.status(200).json({
    success: true,
    message: "Admin logged out successfully"
  });

  
 }

async refresh(req: Request, res: Response): Promise<Response> {
  const { refreshToken } = req.body;

  const result =
    await this._adminAuthService.refresh(refreshToken);

  return res.status(200).json({
    success: true,
    data: result
  });
}

}

 
