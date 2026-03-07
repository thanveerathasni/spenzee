import { injectable } from "inversify";
import { Types } from "mongoose";

import {
  ProviderRequestModel,
  IProviderRequest,
  ProviderRequestStatus,
} from "../../../models/ProviderRequest.model";

import {
  IProviderRequestRepository,
  CreateProviderRequestDTO,
} from "../../../types/repositories/provider/IProviderRequestRepository";

@injectable()
export class ProviderRequestRepository
  implements IProviderRequestRepository
{
  async create(
    data: CreateProviderRequestDTO
  ): Promise<IProviderRequest> {
    return ProviderRequestModel.create(data);
  }

  async findById(id: string): Promise<IProviderRequest | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return ProviderRequestModel.findById(id).exec();
  }

  async findAll(): Promise<IProviderRequest[]> {
    return ProviderRequestModel.find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByStatus(
    status: ProviderRequestStatus
  ): Promise<IProviderRequest[]> {
    return ProviderRequestModel.find({ status })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(
    id: string,
    status: ProviderRequestStatus,
    reviewedBy: string,
    rejectionReason?: string
  ): Promise<IProviderRequest | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return ProviderRequestModel.findByIdAndUpdate(
      id,
      {
        status,
        reviewedBy,
        reviewedAt: new Date(),
        rejectionReason:
          status === ProviderRequestStatus.REJECTED
            ? rejectionReason
            : undefined,
      },
      { new: true }
    ).exec();
  }
}