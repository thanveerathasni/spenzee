import {
  AdminProviderDTO,
  ProviderDTO,
  ProviderProfileDTO,
} from "../dto/provider.dto";
import { IUser } from "../models/User.model";

export class ProviderMapper {
  static toDTO(provider: IUser): ProviderDTO {
    return {
      id: provider._id.toString(),
      name: provider.name,
      email: provider.email,
      commerceStatus: provider.commerceStatus,
      commissionPercentage: provider.commissionPercentage,
      commerceEnabled: provider.commerceEnabled,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };
  }

  static toProfileDTO(provider: IUser): ProviderProfileDTO {
    return {
      id: provider._id.toString(),
      name: provider.name,
      email: provider.email,
      commerceStatus: provider.commerceStatus,
      commissionPercentage: provider.commissionPercentage,
      commerceEnabled: provider.commerceEnabled,
      commerceFrozen: provider.commerceFrozen,
    };
  }

  static toAdminDTO(provider: IUser): AdminProviderDTO {
    return {
      id: provider._id.toString(),
      name: provider.name,
      email: provider.email,
      isVerified: provider.isVerified,
      isActive: provider.isActive,
      commerceStatus: provider.commerceStatus,
      commissionPercentage: provider.commissionPercentage,
      commerceEnabled: provider.commerceEnabled,
      commerceFrozen: provider.commerceFrozen,
      commerceApprovedAt: provider.commerceApprovedAt,
      commerceRejectedReason: provider.commerceRejectedReason,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };
  }
}
