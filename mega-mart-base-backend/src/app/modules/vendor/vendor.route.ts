import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { vendorControllers } from "./vendor.controller";
import { createVendorZodSchema } from "./vendor.validations";

const router = express.Router();

router.get("/", vendorControllers.getAllVendor);

router.get("/:id", vendorControllers.getSingleVendor);

router.post(
  "/create-vendor",
  validateRequest(createVendorZodSchema),
  vendorControllers.createVendor
);

router.get('/user/:userId', vendorControllers.getVendorByUserId)
router.patch('/status-update/:id', vendorControllers.updateStatus)

export const VendorRoutes = router;
