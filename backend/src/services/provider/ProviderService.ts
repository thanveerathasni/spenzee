import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IProviderService } from "../../types/services/provider/IProviderService";
import { IProviderRepository } from "../../types/repositories/provider/IProviderRepository";
import { IProvider } from "../../models/Provider.model";

@injectable()
export class ProviderService implements IProviderService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly providerRepository: IProviderRepository
  ) {}

  async createProvider(data: {
    brandName: string;
    email: string;
    primaryCategory: string;
    websiteUrl?: string;
    description?: string;
  }): Promise<IProvider> {
    const existingProvider =
      await this.providerRepository.findByEmail(data.email);

    if (existingProvider) {
      throw new Error("Provider already exists with this email");
    }

    return await this.providerRepository.create(data);
  }
}
