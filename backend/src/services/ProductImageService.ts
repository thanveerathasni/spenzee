import { injectable } from "inversify";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { PRODUCT_IMAGE_LIMITS } from "../constants/product";
import { BadRequestError } from "../utils/errors";

@injectable()
export class ProductImageService {
  validateThumbnail(thumbnail: string): string {
    if (!thumbnail.trim()) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.THUMBNAIL_REQUIRED);
    }

    this.validateImage(thumbnail);
    return thumbnail;
  }

  validateGallery(images: string[]): string[] {
    if (images.length > PRODUCT_IMAGE_LIMITS.MAX_GALLERY_IMAGES) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.TOO_MANY_IMAGES);
    }

    images.forEach((image) => this.validateImage(image));
    return images;
  }

  private validateImage(image: string): void {
    const hasAllowedPrefix =
      PRODUCT_IMAGE_LIMITS.ALLOWED_PREFIXES.some((prefix) =>
        image.startsWith(prefix)
      );

    if (!hasAllowedPrefix) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.INVALID_IMAGE);
    }

    const base64 = image.split(",")[1] ?? "";
    const estimatedBytes = Math.ceil((base64.length * 3) / 4);

    if (estimatedBytes > PRODUCT_IMAGE_LIMITS.MAX_IMAGE_BYTES) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.INVALID_IMAGE);
    }
  }
}
