import express from "express";
import { categoryControllers } from "./category.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createCategoryZodSchema, updateCategoryZodSchema } from "./category.validations";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.get("/", categoryControllers.getAllCategory);

router.get("/:id", categoryControllers.getSingleCategory);

router.post(
  '/create-category',
  multerUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'bannerImg', maxCount: 1 },
  ]),
  validateRequest(createCategoryZodSchema),
  categoryControllers.createCategory
);


router.patch(
  '/edit-category/:id',
  multerUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'bannerImg', maxCount: 1 },
  ]),
  validateRequest(updateCategoryZodSchema),
  categoryControllers.editCategory
);
router.delete("/delete-category/:id", categoryControllers.deleteCategory);

export const CategoryRoutes = router;
