import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { productControllers } from "./product.controller";
import { createProductZodSchema, updateProductZodSchema } from "./product.validations";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.post(
  '/create-product',
  multerUpload.fields([
    { name: 'galleryImagesFiles' , maxCount: 20},
    { name: 'featuredImgFile', maxCount: 1 },
  ]),
  validateRequest(createProductZodSchema),
  productControllers.createProduct
);
router.get("/", productControllers.getAllProduct);
router.get('/best-selling-products', productControllers.bestSellingProducts);
router.get('/products/by', productControllers.getProductsByCategoryandTag)
router.get('/inventory/stats', productControllers.inventoryStats);
router.get("/:id", productControllers.getSingleProduct);
router.patch(
  '/update-product/:id',
  multerUpload.fields([
    { name: 'galleryImagesFiles', maxCount: 20 },
    { name: 'featuredImgFile', maxCount: 1 },
  ]),
  validateRequest(updateProductZodSchema),
  productControllers.updateProduct
);


router.delete('/delete-product/:id', productControllers.deleteProduct);



export const ProductRoutes = router;
