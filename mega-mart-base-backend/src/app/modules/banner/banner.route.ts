import { Router } from "express";
import { bannerController } from "./banner.controller";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { createBannerSchema, updateBannerSchema } from "./banner.validation";



const router = Router()




router.post('/create', multerUpload.single('image'), validateRequest(createBannerSchema), bannerController.createBanner)

router.patch(
  '/update/:id',
  multerUpload.single('image'),
  validateRequest(updateBannerSchema),
  bannerController.updateBanner
);

router.delete(
  '/delete/:id',
  bannerController.deleteBanner
);

router.get('/', bannerController.getAllBanners);



export const bannerRoute = router