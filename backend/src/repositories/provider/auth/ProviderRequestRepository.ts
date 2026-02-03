import { injectable } from 'inversify';
import { Types } from 'mongoose';

import {
  ProviderRequestModel,
  IProviderRequest,
  ProviderRequestStatus,
} from '../../../models/ProviderRequest.model';

import { IProviderRequestRepository } from '../../../types/repositories/provider/IProviderRequestRepository';

@injectable()
export class ProviderRequestRepository
  implements IProviderRequestRepository
{
  async create(
    data: Omit<
      IProviderRequest,
      | '_id'
      | 'status'
      | 'reviewedBy'
      | 'reviewedAt'
      | 'rejectionReason'
      | 'createdAt'
      | 'updatedAt'
    >
  ): Promise<IProviderRequest> {
    return await ProviderRequestModel.create(data);
  }

  async findById(id: string): Promise<IProviderRequest | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return await ProviderRequestModel.findById(id);
  }

  async findAll(): Promise<IProviderRequest[]> {
    return await ProviderRequestModel.find().sort({ createdAt: -1 });
  }

  async findByStatus(
    status: ProviderRequestStatus
  ): Promise<IProviderRequest[]> {
    return await ProviderRequestModel
      .find({ status })
      .sort({ createdAt: -1 });
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

    return await ProviderRequestModel.findByIdAndUpdate(
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
    );
  }
}
