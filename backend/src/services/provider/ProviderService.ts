import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IProvider } from "../../models/Provider.model";
import { ProviderDTO } from "../../shared/dto/provider/provider.dto";

import { ProviderMapper } from "../../shared/mapper/provider/ProviderMapper";
import { IProviderRepository } from "../../types/repositories/provider/IProviderRepository";
import { CreateProviderRequestDTO } from "../../types/repositories/provider/IProviderRequestRepository";


@injectable()
export class ProviderService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _repo: IProviderRepository
  ) {}

  async createProvider(data: Partial<IProvider>): Promise<ProviderDTO> {
  const provider = await this._repo.create(data);
  return ProviderMapper.toDTO(provider);
}

  async updatePassword(providerId: string, password: string): Promise<void> {
    await this._repo.updatePassword(providerId, password);
  }
}