import { ProductDTO } from "../dto/product.dto";
import { IProduct } from "../models/Product.model";

export class ProductMapper {
  static toDTO(product: IProduct): ProductDTO {
    return {
      id: product._id.toString(),
      providerId: product.providerId.toString(),
      productIdentificationCode: product.productIdentificationCode,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      categoryId: product.categoryId,
      brand: product.brand,
      images: product.images,
      thumbnail: product.thumbnail,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      minimumStock: product.minimumStock,
      status: product.status,
      tags: product.tags,
      specifications: product.specifications,
      warranty: product.warranty,
      returnPolicy: product.returnPolicy,
      createdBy: product.createdBy.toString(),
      updatedBy: product.updatedBy?.toString(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
