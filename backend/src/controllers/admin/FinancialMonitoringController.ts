import {
  Request,
  Response,
} from "express";
import {
  inject,
  injectable,
} from "inversify";

import { TYPES } from "../../di/types";
import {
  BANK_STATEMENT_STATUS,
  BankStatementStatus,
} from "../../shared/constants/bankStatement";
import {
  sendResponse,
} from "../../shared/utils/sendResponse";
import {
  AdminStatementStatusPayload,
  IBankStatementService,
} from "../../types/services/financial/IBankStatementService";

@injectable()
export class FinancialMonitoringController {
  constructor(
    @inject(TYPES.BankStatementService)
    private readonly _bankStatementService:
      IBankStatementService,
  ) {}

  async statements(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const status =
      this.parseStatus(req);

    const data =
      await this._bankStatementService.getAdminStatements(
        req.params.id,
        status,
      );

    return sendResponse({
      res,
      message:
        "User statements fetched successfully",
      data,
    });
  }

  async analytics(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._bankStatementService.getAdminAnalytics(
        req.params.id,
      );

    return sendResponse({
      res,
      message:
        "User financial analytics fetched successfully",
      data,
    });
  }

  async updateStatementStatus(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._bankStatementService.updateAdminStatementStatus(
        req.params.id,
        req.params.statementId,
        req.body as AdminStatementStatusPayload,
      );

    return sendResponse({
      res,
      message:
        "Statement monitoring status updated successfully",
      data,
    });
  }

  private parseStatus(
    req: Request,
  ): BankStatementStatus | undefined {
    if (
      typeof req.query.status !==
      "string"
    ) {
      return undefined;
    }

    return Object.values(
      BANK_STATEMENT_STATUS,
    ).includes(
      req.query.status as never,
    )
      ? (req.query.status as BankStatementStatus)
      : undefined;
  }
}
