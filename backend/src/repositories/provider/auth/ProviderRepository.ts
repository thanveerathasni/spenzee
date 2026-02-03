import { injectable } from "inversify";
import { Types } from "mongoose";

import { ProviderModel, IProvider } from "../../../models/Provider.model";
import { IProviderRepository } from "../../../types/repositories/provider/IProviderRepository";

@injectable()
export class ProviderRepository implements IProviderRepository {
  async create(data: {
    brandName: string;
    email: string;
    primaryCategory: string;
    websiteUrl?: string;
    description?: string;
  }): Promise<IProvider> {
    return await ProviderModel.create(data);
  }

  async findByEmail(email: string): Promise<IProvider | null> {
    return await ProviderModel.findOne({ email });
  }

  async findById(id: string): Promise<IProvider | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return await ProviderModel.findById(id);
  }
}
