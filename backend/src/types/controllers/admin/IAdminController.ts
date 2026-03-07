import { Request, Response } from "express";

export interface IAdminController {
  getDashboard(req: Request, res: Response): Promise<void>;
}


