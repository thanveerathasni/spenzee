import { IProviderRequest } from '../../../models/ProviderRequest.model';
import { ProviderRequestStatus } from '../../../models/ProviderRequest.model';

export interface IProviderRequestRepository {
  create(
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
  ): Promise<IProviderRequest>;

  findById(id: string): Promise<IProviderRequest | null>;

  findAll(): Promise<IProviderRequest[]>;

  findByStatus(
    status: ProviderRequestStatus
  ): Promise<IProviderRequest[]>;

  updateStatus(
    id: string,
    status: ProviderRequestStatus,
    reviewedBy: string,
    rejectionReason?: string
  ): Promise<IProviderRequest | null>;
}
