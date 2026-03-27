import { Router } from "express";
import { settingControllers } from "./settings.controller";
import { multerUpload } from "../../config/multer.config";
import { updateSiteSettingsZodSchema } from "./settings.validations";
import validateRequest from "../../middlewares/validateRequest";





const router = Router()



router.get('/', settingControllers.getSetting);



router.patch(
  '/:id',
  multerUpload.fields([
    { name: 'siteLogo', maxCount: 1 },
    { name: 'appInfoBanner', maxCount: 1 },
    { name: 'discountBanner', maxCount: 1 },
  ]),
  validateRequest(updateSiteSettingsZodSchema),
  settingControllers.updateSetting
);



export const settingRoute = router