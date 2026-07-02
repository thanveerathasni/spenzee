import { CommerceStatus } from "../constants/commerce";

export interface ProviderDTO {
  id: string;
  name?: string;
  email: string;
  commerceStatus: CommerceStatus;
  commissionPercentage: number;
  commerceEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderProfileDTO {
  id: string;
  name?: string;
  email: string;
  commerceStatus: CommerceStatus;
  commissionPercentage: number;
  commerceEnabled: boolean;
  commerceFrozen: boolean;
}

export interface AdminProviderDTO {
  id: string;
  name?: string;
  email: string;
  isVerified: boolean;
  isActive: boolean;
  commerceStatus: CommerceStatus;
  commissionPercentage: number;
  commerceEnabled: boolean;
  commerceFrozen: boolean;
  commerceApprovedAt?: Date;
  commerceRejectedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
