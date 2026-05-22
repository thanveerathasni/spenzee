import { injectable } from "inversify";
import { Types } from "mongoose";
import {
  IProviderVerification,
  ProviderVerificationModel,
} from "../../models/ProviderVerification.model";
import { VERIFICATION_STATUS, VerificationStatus } from "../../shared/constants/verification";
import {
  CreateProviderVerificationData,
  IProviderVerificationRepository,
} from "../../types/repositories/verification/IProviderVerificationRepository";

type ProviderVerificationQuery = {
  verificationStatus?: VerificationStatus;
  $or?: Array<{
    licenseType?: { $regex: string; $options: "i" };
  }>;
};

@injectable()
export class ProviderVerificationRepository implements IProviderVerificationRepository {
  async create(data: CreateProviderVerificationData): Promise<IProviderVerification> {
    return ProviderVerificationModel.create({
      ...data,
      verificationStatus: VERIFICATION_STATUS.PENDING,
    });
  }

  async findLatestByProviderId(providerId: string): Promise<IProviderVerification | null> {
    return ProviderVerificationModel.findOne({ providerId }).sort({ createdAt: -1 }).exec();
  }

  async findPendingByProviderId(providerId: string): Promise<IProviderVerification | null> {
    return ProviderVerificationModel.findOne({
      providerId,
      verificationStatus: VERIFICATION_STATUS.PENDING,
    }).exec();
  }

  async findById(id: string): Promise<IProviderVerification | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return ProviderVerificationModel.findById(id).exec();
  }

  async findAll(
    status: VerificationStatus | "",
    search: string,
  ): Promise<IProviderVerification[]> {
    const query: ProviderVerificationQuery = {};

    if (status) {
      query.verificationStatus = status;
    }

    if (search) {
      query.$or = [{ licenseType: { $regex: search, $options: "i" } }];
    }

    return ProviderVerificationModel.find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateReview(
    id: string,
    status: VerificationStatus,
    reviewedBy: string,
    rejectionReason?: string,
  ): Promise<IProviderVerification | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    return ProviderVerificationModel.findOneAndUpdate(
      {
        _id: id,
        verificationStatus: VERIFICATION_STATUS.PENDING,
      },
      {
        verificationStatus: status,
        reviewedBy,
        reviewedAt: new Date(),
        rejectionReason: status === VERIFICATION_STATUS.REJECTED ? rejectionReason : undefined,
      },
      { new: true },
    ).exec();
  }
}
