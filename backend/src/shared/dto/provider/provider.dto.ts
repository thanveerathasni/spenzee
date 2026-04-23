export interface ProviderDTO {
  id: string;
  brandName: string;
  email: string;
  primaryCategory: string;
  websiteUrl?: string;
  description?: string;
  createdAt: Date;
  hasAcceptedTerms: boolean;
}
