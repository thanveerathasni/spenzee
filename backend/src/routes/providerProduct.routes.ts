import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { authGuard } from "../middleware/authGuard";
import { requireCommerceEnabled } from "../middleware/requireCommerceEnabled";
import { roleGuard } from "../middleware/roleGuard";
import { validate } from "../middleware/validate";
import { ROLES } from "../constants/roles";
import {
  createProductSchema,
  productIdParamSchema,
  productListSchema,
  productStockSchema,
  updateProductSchema,
} from "../validators/product.validator";

const router = Router();
const controller = container.get<ProductController>(TYPES.ProductController);

router.use(authGuard, roleGuard([ROLES.PROVIDER]), requireCommerceEnabled);

router.post("/", validate(createProductSchema), controller.create.bind(controller));
router.get("/", validate(productListSchema), controller.list.bind(controller));
router.get("/:id", validate(productIdParamSchema), controller.getById.bind(controller));
router.patch("/:id", validate(updateProductSchema), controller.update.bind(controller));
router.delete("/:id", validate(productIdParamSchema), controller.delete.bind(controller));
router.patch(
  "/:id/archive",
  validate(productIdParamSchema),
  controller.archive.bind(controller)
);
router.patch(
  "/:id/restore",
  validate(productIdParamSchema),
  controller.restore.bind(controller)
);
router.patch(
  "/:id/stock",
  validate(productStockSchema),
  controller.updateStock.bind(controller)
);

export default router;
