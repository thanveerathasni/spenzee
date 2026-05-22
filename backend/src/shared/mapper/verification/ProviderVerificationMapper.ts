import { IProviderVerification } from "../../../models/ProviderVerification.model";
import { ProviderVerificationDTO } from "../../dto/verification/providerVerification.dto";

export class ProviderVerificationMapper {
  static toDTO(verification: IProviderVerification): ProviderVerificationDTO {
    return {
      id: verification._id.toString(),
      providerId: verification.providerId.toString(),
      licenseType: verification.licenseType,
      documentUrl: verification.documentUrl,
      verificationStatus: verification.verificationStatus,
      rejectionReason: verification.rejectionReason,
      reviewedBy: verification.reviewedBy?.toString(),
      reviewedAt: verification.reviewedAt?.toISOString(),
      createdAt: verification.createdAt.toISOString(),
      updatedAt: verification.updatedAt.toISOString(),
    };
  }
}
