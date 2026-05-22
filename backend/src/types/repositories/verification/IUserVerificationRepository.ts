import { Types } from "mongoose";
import { IUserVerification } from "../../../models/UserVerification.model";
import {
  UserDocumentType,
  VerificationStatus,
} from "../../../shared/constants/verification";

export interface CreateUserVerificationData {
  userId: Types.ObjectId;
  documentType: UserDocumentType;
  frontDocumentUrl: string;
  backDocumentUrl?: string;
}

export interface IUserVerificationRepository {
  create(data: CreateUserVerificationData): Promise<IUserVerification>;
  findLatestByUserId(userId: string): Promise<IUserVerification | null>;
  findPendingByUserId(userId: string): Promise<IUserVerification | null>;
  findById(id: string): Promise<IUserVerification | null>;
  findAll(
    status: VerificationStatus | "",
    search: string,
  ): Promise<IUserVerification[]>;
  updateReview(
    id: string,
    status: VerificationStatus,
    reviewedBy: string,
    rejectionReason?: string,
  ): Promise<IUserVerification | null>;
}
