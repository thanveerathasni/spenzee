import { injectable } from "inversify";
import { Types } from "mongoose";

import {
  ProviderRequestModel,
  IProviderRequest,
} from "../../../models/ProviderRequest.model";

import { BaseRepository } from "../../../shared/base/BaseRepository";
import { ProviderRequestStatus } from "../../../shared/constants/providerRequestStatus";

import {
  IProviderRequestRepository,
  CreateProviderRequestDTO,
} from "../../../types/repositories/provider/IProviderRequestRepository";


@injectable()
export class ProviderRequestRepository
  extends BaseRepository<IProviderRequest>
  implements IProviderRequestRepository
{
  constructor() {
    super(ProviderRequestModel);
  }

  async create(data: CreateProviderRequestDTO): Promise<IProviderRequest> {
    return super.create(data);
  }

  async findById(id: string): Promise<IProviderRequest | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return super.findById(id);
  }

  async findAll(): Promise<IProviderRequest[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findByStatus(status: ProviderRequestStatus): Promise<IProviderRequest[]> {
    return this.model.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async updateStatus(
    id: string,
    status: ProviderRequestStatus,
    reviewedBy: string,
    rejectionReason?: string,
  ): Promise<IProviderRequest | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    return this.update(
      { _id: id },
      {
        status,
        reviewedBy,
        reviewedAt: new Date(),
        rejectionReason:
          status === ProviderRequestStatus.REJECTED
            ? rejectionReason
            : undefined,
      }
    );
  }
}