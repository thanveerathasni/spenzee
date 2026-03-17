import { Response } from "express"
import { inject, injectable } from "inversify"

import { TYPES } from "../../di/types"

import { HTTP_STATUS } from "../../shared/constants/httpStatus"
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages"
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages"

import { UnauthorizedError } from "../../shared/errors/errors"
import { sendResponse } from "../../shared/utils/sendResponse"

import { IAdminService } from "../../types/services/admin/IAdminService"
import { AuthRequest } from "../../types/services/user/AuthRequest"

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.AdminService)
    private readonly _adminService: IAdminService
  ) {}

  async getDashboard(req: AuthRequest, res: Response) {
    if (!req.admin) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED)
    }

    const dashboard = await this._adminService.getDashboard(req.admin.id)

    return sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: SUCCESS_MESSAGES.ADMIN.DASHBOARD_FETCHED,
      data: dashboard
    })
  }
}