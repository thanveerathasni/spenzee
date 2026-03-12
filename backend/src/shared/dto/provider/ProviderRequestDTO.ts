export interface ProviderRequestDTO {
  id: string;
  brandName: string;
  websiteUrl: string;
  primaryCategory: string;
  contactEmail: string;
  description: string;
  status: ProviderRequestStatus;
  rejectionReason?: string;
}