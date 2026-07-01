// import { IProvider } from "../../../models/Provider.model";
// import { ProviderDTO } from "../../../shared/dto/provider/provider.dto";

// export class ProviderMapper {
//   static toDTO(provider: IProvider): ProviderDTO {
//     return {
//       id: provider._id.toString(),
//       brandName: provider.brandName,
//       companyName: provider.companyName,
//       email: provider.email,
//       phone: provider.phone,
//       gstNumber: provider.gstNumber,
//       licenseNumber: provider.licenseNumber,
//       primaryCategory: provider.primaryCategory,
//       websiteUrl: provider.websiteUrl ?? undefined,
//       socialLinks: provider.socialLinks,
//       description: provider.description ?? undefined,
//       profileImage: provider.profileImage,
//       status: provider.status,
//       createdAt: provider.createdAt,
//       updatedAt: provider.updatedAt,
//       hasAcceptedTerms: provider.hasAcceptedTerms,
//     };
//   }
// }












import { IProvider } from "../../../models/Provider.model";

import { ProviderDTO } from "../../../shared/dto/provider/provider.dto";

export class ProviderMapper {
  static toDTO(
    provider: IProvider,
  ): ProviderDTO {
    return {
      id: provider._id.toString(),

      brandName:
        provider.brandName,

      companyName:
        provider.companyName ??
        undefined,

      email:
        provider.email,

      phone:
        provider.phone ??
        undefined,

      gstNumber:
        provider.gstNumber ??
        undefined,

      licenseNumber:
        provider.licenseNumber ??
        undefined,

      primaryCategory:
        provider.primaryCategory,

      websiteUrl:
        provider.websiteUrl ??
        undefined,

      socialLinks:
        provider.socialLinks ??
        [],

      description:
        provider.description ??
        undefined,

      profileImage:
        provider.profileImage ??
        undefined,

      status:
        provider.status,

      commerceStatus:
        provider.commerceStatus,

      commerceEnabled:
        provider.commerceEnabled,

      commerceEnabledAt:
        provider.commerceEnabledAt ??
        undefined,

      commerceApprovedBy:
        provider.commerceApprovedBy
          ?.toString(),

      commerceRejectedReason:
        provider.commerceRejectedReason ??
        undefined,

      commissionPercentage:
        provider.commissionPercentage,

      isCommerceFrozen:
        provider.isCommerceFrozen,

      createdAt:
        provider.createdAt,

      updatedAt:
        provider.updatedAt,

      hasAcceptedTerms:
        provider.hasAcceptedTerms,
    };
  }
}
