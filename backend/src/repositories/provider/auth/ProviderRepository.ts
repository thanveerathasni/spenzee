import { injectable } from "inversify";

import { Types } from "mongoose";

import {
  IProvider,
  ProviderModel,
  ProviderStatus,
} from "../../../models/Provider.model";

import { BaseRepository } from "../../../shared/base/BaseRepository";

import { ProviderDashboardDTO } from "../../../shared/dto/provider/providerDashboard";

import { IProviderRepository } from "../../../types/repositories/provider/IProviderRepository";

type ProviderSearchCondition = {
  brandName?: {
    $regex: string;
    $options: "i";
  };

  email?: {
    $regex: string;
    $options: "i";
  };
};

type ProviderListQuery = {
  status?: ProviderStatus;

  $or?: ProviderSearchCondition[];
};

@injectable()
export class ProviderRepository
  extends BaseRepository<IProvider>
  implements IProviderRepository
{
  constructor() {
    super(ProviderModel);
  }

  /* ====================================================== */
  /* FIND */
  /* ====================================================== */

  async findByEmail(
    email: string,
  ): Promise<IProvider | null> {
    return this.model
      .findOne({ email })
      .select("+password")
      .exec();
  }

  async findByIdWithPassword(
    providerId: string,
  ): Promise<IProvider | null> {
    return this.model
      .findById(providerId)
      .select("+password")
      .exec();
  }

  async findAll(
    status?: ProviderStatus,
  ): Promise<IProvider[]> {
    const filter = status
      ? { status }
      : {};

    return this.model
      .find(filter)
      .exec();
  }

  /* ====================================================== */
  /* PASSWORD */
  /* ====================================================== */

  async updatePassword(
    providerId: string,
    password: string,
  ): Promise<void> {
    if (
      !Types.ObjectId.isValid(
        providerId,
      )
    ) {
      return;
    }

    await this.model
      .findByIdAndUpdate(
        providerId,
        { password },
      )
      .exec();
  }

  /* ====================================================== */
  /* UPDATE */
  /* ====================================================== */

  async updateById(
    providerId: string,
    data: Partial<IProvider>,
  ): Promise<IProvider | null> {
    if (
      !Types.ObjectId.isValid(
        providerId,
      )
    ) {
      return null;
    }

    return this.model
      .findByIdAndUpdate(
        providerId,
        data,
        {
          new: true,
        },
      )
      .exec();
  }

  async updateStatus(
    providerId: string,
    status: ProviderStatus,
  ): Promise<void> {
    await this.model
      .findByIdAndUpdate(
        providerId,
        { status },
      )
      .exec();
  }

  /* ====================================================== */
  /* PAGINATION */
  /* ====================================================== */

  async findAllPaginated(
    status: ProviderStatus | "",
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    providers: IProvider[];

    total: number;
  }> {
    const query: ProviderListQuery =
      {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        {
          brandName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

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
      providers:
        result.data,

      total:
        result.total,
    };
  }

  /* ====================================================== */
  /* DASHBOARD */
  /* ====================================================== */

  async getDashboardStats(
    providerId: string,
  ): Promise<ProviderDashboardDTO | null> {
    if (
      !Types.ObjectId.isValid(
        providerId,
      )
    ) {
      return null;
    }

    return {
      totalProducts: 0,

      totalSales: 0,

      revenue: 0,
    };
  }
}