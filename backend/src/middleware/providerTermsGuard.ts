import { Request, Response, NextFunction } from "express";
import { ProviderModel } from "../models/Provider.model";

export const providerTermsGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const providerId = (req as any).user?.id;

  if (!providerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const provider = await ProviderModel.findById(providerId);

  if (!provider) {
    return res.status(401).json({ message: "Provider not found" });
  }

  if (!provider.hasAcceptedTerms) {
    return res.status(403).json({
      message: "Terms not accepted",
      redirect: "/provider/welcome",
    });
  }

  next();
};