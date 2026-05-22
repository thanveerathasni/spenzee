import { injectable } from "inversify";
import { Types } from "mongoose";
import {
  IUserVerification,
  UserVerificationModel,
} from "../../models/UserVerification.model";
import { VERIFICATION_STATUS, VerificationStatus } from "../../shared/constants/verification";
import {
  CreateUserVerificationData,
  IUserVerificationRepository,
} from "../../types/repositories/verification/IUserVerificationRepository";

type UserVerificationQuery = {
  verificationStatus?: VerificationStatus;
  $or?: Array<{
    documentType?: { $regex: string; $options: "i" };
  }>;
};

@injectable()
export class UserVerificationRepository implements IUserVerificationRepository {
  async create(data: CreateUserVerificationData): Promise<IUserVerification> {
    return UserVerificationModel.create({
      ...data,
      verificationStatus: VERIFICATION_STATUS.PENDING,
    });
  }

  async findLatestByUserId(userId: string): Promise<IUserVerification | null> {
    return UserVerificationModel.findOne({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findPendingByUserId(userId: string): Promise<IUserVerification | null> {
    return UserVerificationModel.findOne({
      userId,
      verificationStatus: VERIFICATION_STATUS.PENDING,
    }).exec();
  }

  async findById(id: string): Promise<IUserVerification | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return UserVerificationModel.findById(id).exec();
  }

  async findAll(
    status: VerificationStatus | "",
    search: string,
  ): Promise<IUserVerification[]> {
    const query: UserVerificationQuery = {};

    if (status) {
      query.verificationStatus = status;
    }

    if (search) {
      query.$or = [{ documentType: { $regex: search, $options: "i" } }];
    }

    return UserVerificationModel.find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateReview(
    id: string,
    status: VerificationStatus,
    reviewedBy: string,
    rejectionReason?: string,
  ): Promise<IUserVerification | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    return UserVerificationModel.findOneAndUpdate(
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
