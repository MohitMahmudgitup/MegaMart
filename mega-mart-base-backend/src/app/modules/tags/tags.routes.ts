import express from "express";
import { tagControllers } from "./tags.controllers";
import { multerUpload } from "../../config/multer.config";
import { createTagZodSchema, updateTagZodSchema } from "./tags.validations";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/", tagControllers.getAllTags);

router.get("/:id", tagControllers.getSingleTag);

router.post(
  '/create-tag',
  multerUpload.single('image'),
  validateRequest(createTagZodSchema),
  tagControllers.createTag
);
router.patch(
  '/update-tag/:id',
  multerUpload.single('image'),
  validateRequest(updateTagZodSchema),
  tagControllers.updateTag
);

router.get('/stats/all', tagControllers.getStatus)

export const TagRoutes = router;
