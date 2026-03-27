import express from "express";
import { subCategoryControllers } from "./subCategory.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createCategoryZodSchema, updateCategoryZodSchema } from "./subCategory.validations";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.get("/", subCategoryControllers.getAllsubCategory);

router.get("/:id", subCategoryControllers.getSinglesubCategory);

router.post(
  '/create-subcategory',
  multerUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'bannerImg', maxCount: 1 },
  ]),
  validateRequest(createCategoryZodSchema),
  subCategoryControllers.createsubCategory
);


// router.patch(
//   '/edit-category/:id',
//   multerUpload.fields([
//     { name: 'image', maxCount: 1 },
//     { name: 'bannerImg', maxCount: 1 },
//   ]),
//   validateRequest(updateCategoryZodSchema),
//   categoryControllers.editCategory
// );
// router.delete("/delete-category/:id", categoryControllers.deleteCategory);

export const SubCategoryRoutes = router;
