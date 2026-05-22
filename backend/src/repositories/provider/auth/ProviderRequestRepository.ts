import { injectable } from "inversify";

import { Types } from "mongoose";

import {
  IProviderRequest,
  ProviderRequestModel,
} from "../../../models/ProviderRequest.model";

import { BaseRepository } from "../../../shared/base/BaseRepository";

import {
  ProviderRequestStatus,
} from "../../../shared/constants/providerRequestStatus";

import {
  CreateProviderRequestDTO,
  IProviderRequestRepository,
} from "../../../types/repositories/provider/IProviderRequestRepository";

@injectable()
export class ProviderRequestRepository
  extends BaseRepository<IProviderRequest>
  implements IProviderRequestRepository
{
  constructor() {
    super(
      ProviderRequestModel,
    );
  }

  /* ====================================================== */
  /* CREATE */
  /* ====================================================== */

  async create(
    data: CreateProviderRequestDTO,
  ): Promise<IProviderRequest> {
    return super.create(
      data,
    );
  }

  /* ====================================================== */
  /* FIND */
  /* ====================================================== */

  async findById(
    id: string,
  ): Promise<IProviderRequest | null> {
    if (
      !Types.ObjectId.isValid(
        id,
      )
    ) {
      return null;
    }

    return super.findById(
      id,
    );
  }

  async findAll(): Promise<
    IProviderRequest[]
  > {
    return this.model
      .find()
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async findByStatus(
    status: ProviderRequestStatus,
  ): Promise<
    IProviderRequest[]
  > {
    return this.model
      .find({
        status,
      })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  /* ====================================================== */
  /* PAGINATION */
  /* ====================================================== */

  async findAllPaginated(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    requests: IProviderRequest[];

    total: number;

    page: number;

    totalPages: number;
  }> {
    const query = search
      ? {
          $or: [
            {
              brandName: {
                $regex: search,
                $options: "i",
              },
            },
            {
              contactEmail:
                {
                  $regex: search,
                  $options: "i",
                },
            },
          ],
        }
      : {};

    const result =
      await this.paginate(
        query,
        {
          page,
          limit,
          sort: {
            createdAt: -1,
          },
        },
      );

    return {
      requests:
        result.data,

      total:
        result.total,

      page:
        result.page,

      totalPages:
        result.totalPages,
    };
  }

  /* ====================================================== */
  /* STATUS */
  /* ====================================================== */

  async updateStatus(
    id: string,
    status: ProviderRequestStatus,
    reviewedBy: string,
    rejectionReason?: string,
  ): Promise<IProviderRequest | null> {
    if (
      !Types.ObjectId.isValid(
        id,
      )
    ) {
      return null;
    }

    return this.updateOne(
      {
        _id: id,
      },
      {
        status,

        reviewedBy,

        reviewedAt:
          new Date(),

        rejectionReason:
          status ===
          ProviderRequestStatus.REJECTED
            ? rejectionReason
            : undefined,
      },
    );
  }
}