import { IProviderRequest } from "../../../models/ProviderRequest.model";
import { ProviderRequestDTO } from "../../../shared/dto/provider/ProviderRequestDTO";

export class ProviderRequestMapper {
  static toDTO(request: IProviderRequest): ProviderRequestDTO {
    return {
      id: request._id.toString(),
      brandName: request.brandName,
      websiteUrl: request.websiteUrl,
      primaryCategory: request.primaryCategory,
      contactEmail: request.contactEmail,
      description: request.description,
      status: request.status,
      rejectionReason: request.rejectionReason,
    };
  }
}