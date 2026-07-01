import { Document, model, Schema, Types } from "mongoose";
import { PRODUCT_STATUS, ProductStatus } from "../constants/product";

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  providerId: Types.ObjectId;
  productIdentificationCode: string;
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  categoryId: string;
  brand: string;
  images: string[];
  thumbnail: string;
  price: number;
  originalPrice?: number;
  stock: number;
  minimumStock: number;
  status: ProductStatus;
  tags: string[];
  specifications: ProductSpecification[];
  warranty?: string;
  returnPolicy?: string;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSpecificationSchema = new Schema<ProductSpecification>(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new Schema<IProduct>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productIdentificationCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    fullDescription: {
      type: String,
      trim: true,
    },
    categoryId: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    minimumStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.DRAFT,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    specifications: {
      type: [productSpecificationSchema],
      default: [],
    },
    warranty: {
      type: String,
      trim: true,
    },
    returnPolicy: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index(
  {
    providerId: 1,
    productIdentificationCode: 1,
  },
  {
    unique: true,
  }
);

productSchema.index({
  providerId: 1,
  status: 1,
  updatedAt: -1,
});

productSchema.index({
  name: "text",
  brand: "text",
  productIdentificationCode: "text",
  tags: "text",
});

export const ProductModel = model<IProduct>("Product", productSchema);
