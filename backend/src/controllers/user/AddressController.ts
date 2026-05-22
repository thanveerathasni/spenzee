import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages";
import { UnauthorizedError } from "../../shared/errors/errors";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { sendResponse } from "../../shared/utils/sendResponse";
import { AddressService } from "../../services/user/AddressService";
import {
  AddressPayload,
  UpdateAddressPayload,
} from "../../validators/address.validator";

@injectable()
export class AddressController {
  constructor(
    @inject(TYPES.AddressService)
    private readonly _addressService: AddressService,
  ) {}

  async list(req: Request, res: Response): Promise<Response> {
    const userId = this.getUserId(req);
    const data = await this._addressService.list(userId);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.USER.ADDRESS_FETCHED,
      data,
    });
  }

  async getPrimary(req: Request, res: Response): Promise<Response> {
    const userId = this.getUserId(req);
    const data = await this._addressService.getPrimary(userId);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.USER.ADDRESS_FETCHED,
      data,
    });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const userId = this.getUserId(req);
    const data = await this._addressService.create(userId, req.body as AddressPayload);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.USER.ADDRESS_CREATED,
      data,
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const userId = this.getUserId(req);
    const data = await this._addressService.update(
      userId,
      req.params.id,
      req.body as UpdateAddressPayload,
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.USER.ADDRESS_UPDATED,
      data,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const userId = this.getUserId(req);
    await this._addressService.delete(userId, req.params.id);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.USER.ADDRESS_DELETED,
    });
  }

  async setPrimary(req: Request, res: Response): Promise<Response> {
    const userId = this.getUserId(req);
    const data = await this._addressService.setPrimary(userId, req.params.id);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.USER.ADDRESS_PRIMARY_SET,
      data,
    });
  }

  private getUserId(req: Request): string {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    return userId;
  }
}
