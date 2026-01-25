import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IAuthService } from "../types/services/IAuthService";
import { sendResponse } from "../utils/sendResponse";
import { SUCCESS_MESSAGES } from "../constants/successMessages";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: IAuthService
  ) {}


async login(req: Request, res: Response): Promise<Response> {
  const { email, password } = req.body;

  await this.authService.login(email, password);

  return sendResponse({
    res,
    message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS
  });
}

}
