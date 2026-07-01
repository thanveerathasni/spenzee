import { api } from "../api/axios";
import type {
  Product,
  ProductListResponse,
  ProductPayload,
  ProductStatus,
} from "../types/product";

interface ProductListParams {
  page?: number;
  search?: string;
  status?: ProductStatus | "";
  categoryId?: string;
  stock?: "LOW" | "OUT" | "IN" | "";
}

export const productService = {
  list: async (params: ProductListParams): Promise<ProductListResponse> => {
    const response = await api.get("/provider/products", {
      params: {
        page: params.page ?? 1,
        limit: 9,
        search: params.search ?? "",
        status: params.status ?? "",
        categoryId: params.categoryId ?? "",
        stock: params.stock ?? "",
      },
    });

    return response.data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/provider/products/${id}`);
    return response.data.data;
  },

  create: async (payload: ProductPayload): Promise<Product> => {
    const response = await api.post("/provider/products", payload);
    return response.data.data;
  },

  update: async (
    id: string,
    payload: Partial<ProductPayload>
  ): Promise<Product> => {
    const response = await api.patch(`/provider/products/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/provider/products/${id}`);
  },

  archive: async (id: string): Promise<Product> => {
    const response = await api.patch(`/provider/products/${id}/archive`);
    return response.data.data;
  },

  restore: async (id: string): Promise<Product> => {
    const response = await api.patch(`/provider/products/${id}/restore`);
    return response.data.data;
  },

  updateStock: async (id: string, stock: number): Promise<Product> => {
    const response = await api.patch(`/provider/products/${id}/stock`, {
      stock,
    });
    return response.data.data;
  },
};
