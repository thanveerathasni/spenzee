import { api } from "./axios";
import { adminApi } from "./admin/adminAxios";
import { API_ROUTES } from "../constants/apiRoutes";
import {
  ProviderLicenseType,
  ProviderVerification,
  UserDocumentType,
  UserVerification,
  VerificationStatus,
} from "../types/verification";

export const userVerificationApi = {
  getStatus: async (): Promise<UserVerification | null> => {
    const res = await api.get(API_ROUTES.USER.VERIFICATION_STATUS);
    return res.data.data;
  },

  submit: async (payload: {
    documentType: UserDocumentType;
    frontDocument: File;
    backDocument?: File;
  }): Promise<UserVerification> => {
    const formData = new FormData();
    formData.append("documentType", payload.documentType);
    formData.append("frontDocument", payload.frontDocument);

    if (payload.backDocument) {
      formData.append("backDocument", payload.backDocument);
    }

    const res = await api.post(API_ROUTES.USER.VERIFICATION, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data;
  },

  checkBankUploadAccess: async (): Promise<boolean> => {
    const res = await api.get(API_ROUTES.USER.BANK_UPLOAD_ACCESS);
    return Boolean(res.data.data.allowed);
  },
};

export const providerVerificationApi = {
  getStatus: async (): Promise<ProviderVerification | null> => {
    const res = await api.get(API_ROUTES.PROVIDER.VERIFICATION_STATUS);
    return res.data.data;
  },

  submit: async (payload: {
    licenseType: ProviderLicenseType;
    document: File;
  }): Promise<ProviderVerification> => {
    const formData = new FormData();
    formData.append("licenseType", payload.licenseType);
    formData.append("document", payload.document);

    const res = await api.post(API_ROUTES.PROVIDER.VERIFICATION, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data;
  },
};

export const adminVerificationApi = {
  getUserVerifications: async (
    status?: VerificationStatus,
    search?: string,
  ): Promise<UserVerification[]> => {
    const res = await adminApi.get(API_ROUTES.ADMIN.USER_VERIFICATIONS, {
      params: { status, search },
    });
    return res.data.data;
  },

  approveUserVerification: async (id: string): Promise<UserVerification> => {
    const res = await adminApi.patch(API_ROUTES.ADMIN.USER_VERIFICATION_APPROVE(id));
    return res.data.data;
  },

  rejectUserVerification: async (
    id: string,
    rejectionReason: string,
  ): Promise<UserVerification> => {
    const res = await adminApi.patch(API_ROUTES.ADMIN.USER_VERIFICATION_REJECT(id), {
      rejectionReason,
    });
    return res.data.data;
  },

  getProviderVerifications: async (
    status?: VerificationStatus,
    search?: string,
  ): Promise<ProviderVerification[]> => {
    const res = await adminApi.get(API_ROUTES.ADMIN.PROVIDER_VERIFICATIONS, {
      params: { status, search },
    });
    return res.data.data;
  },

  approveProviderVerification: async (id: string): Promise<ProviderVerification> => {
    const res = await adminApi.patch(API_ROUTES.ADMIN.PROVIDER_VERIFICATION_APPROVE(id));
    return res.data.data;
  },

  rejectProviderVerification: async (
    id: string,
    rejectionReason: string,
  ): Promise<ProviderVerification> => {
    const res = await adminApi.patch(API_ROUTES.ADMIN.PROVIDER_VERIFICATION_REJECT(id), {
      rejectionReason,
    });
    return res.data.data;
  },
};
