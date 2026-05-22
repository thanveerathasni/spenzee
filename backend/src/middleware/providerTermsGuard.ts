import { Request, Response, NextFunction } from "express";
import { ProviderModel } from "../models/Provider.model";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
import { ROUTES } from "../shared/constants/routes";

export const providerTermsGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const providerId = req.user?.id;

  if (!providerId) {
    res.status(401).json({ message: ERROR_MESSAGES.AUTH.ACCESS_DENIED });
    return;
  }

  const provider = await ProviderModel.findById(providerId);

  if (!provider) {
    res.status(401).json({ message: ERROR_MESSAGES.AUTH.PROVIDER_NOT_FOUND });
    return;
  }

  if (!provider.hasAcceptedTerms) {
    res.status(403).json({
      message: ERROR_MESSAGES.AUTH.TERMS_NOT_ACCEPTED,
      redirect: ROUTES.PROVIDER.WELCOME,
    });
    return;
  }

  next();
};
