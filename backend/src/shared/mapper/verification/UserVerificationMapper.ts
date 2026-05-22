import { IUserVerification } from "../../../models/UserVerification.model";
import { UserVerificationDTO } from "../../dto/verification/userVerification.dto";

export class UserVerificationMapper {
  static toDTO(verification: IUserVerification): UserVerificationDTO {
    return {
      id: verification._id.toString(),
      userId: verification.userId.toString(),
      documentType: verification.documentType,
      frontDocumentUrl: verification.frontDocumentUrl,
      backDocumentUrl: verification.backDocumentUrl,
      verificationStatus: verification.verificationStatus,
      rejectionReason: verification.rejectionReason,
      reviewedBy: verification.reviewedBy?.toString(),
      reviewedAt: verification.reviewedAt?.toISOString(),
      createdAt: verification.createdAt.toISOString(),
      updatedAt: verification.updatedAt.toISOString(),
    };
  }
}
