import { IProvider } from "../../../models/Provider.model";
import { ProviderDTO } from "../../../shared/dto/provider/provider.dto";

export class ProviderMapper {
  static toDTO(provider: IProvider): ProviderDTO {
    return {
      id: provider._id.toString(),
      brandName: provider.brandName,
      email: provider.email,
      primaryCategory: provider.primaryCategory,
      websiteUrl: provider.websiteUrl ?? undefined,
      description: provider.description ?? undefined,
      createdAt: provider.createdAt,
      hasAcceptedTerms: provider.hasAcceptedTerms,
    };
  }
}