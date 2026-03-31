import express from "express";
import { brandsControllers } from "./brands.controller";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { createBrandZodSchema, updateBrandZodSchema } from "./brands.validation";

const router = express.Router();

router.get("/", brandsControllers.getAllBrands);

router.get("/:id", brandsControllers.getSingleBrand);

router.post(
  '/create-brand',
  multerUpload.fields([
    { name: 'gridImage', maxCount: 1 },
    { name: 'sliderImage', maxCount: 1 },
    { name: 'iconImage', maxCount: 1 },
  ]),
  validateRequest(createBrandZodSchema),
  brandsControllers.createBrand
);

router.patch(
  '/update-brand/:id',
  multerUpload.fields([
    { name: 'gridImage', maxCount: 1 },
    { name: 'sliderImage', maxCount: 1 },
    { name: 'iconImage', maxCount: 1 },
  ]),
  validateRequest(updateBrandZodSchema),
  brandsControllers.updateBrand
);
router.get('/products/:id', brandsControllers.getProductsByBrand);
router.delete('/delete/:id', brandsControllers.deleteBrand);

router.get('/type/slider-images', brandsControllers.getsliderImage);

export const BrandRoutes = router;
