import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import { ProviderAuthService } from "../../../services/provider/auth/ProviderAuthService";

@injectable()
export class ProviderAuthController {
  constructor(
    @inject(TYPES.ProviderAuthService)
    private readonly providerAuthService: ProviderAuthService
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const result = await this.providerAuthService.login(
      email,
      password
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  };
}
