import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { couponControllers } from "./coupons.controller";
import { 
  createCouponZodSchema, 
  updateCouponZodSchema,
  validateCouponZodSchema 
} from "./coupons.validations";

const router = express.Router();

// Get all coupons
router.get("/", couponControllers.getAllCoupons);

// Get coupon by code
router.get("/code/:code", couponControllers.getCouponByCode);

// Get single coupon by ID
router.get("/:id", couponControllers.getSingleCoupon);

// Create coupon
router.post(
  "/create-coupon",
  // validateRequest(createCouponZodSchema),
  couponControllers.createCoupon
);

// Validate coupon for order
router.post(
  "/validate",
  // validateRequest(validateCouponZodSchema),
  couponControllers.validateCoupon
);

// Apply coupon (increment usage count)
router.patch("/apply/:id", couponControllers.applyCoupon);

// Update coupon
router.patch(
  "/:id",
  // validateRequest(updateCouponZodSchema),
  couponControllers.updateCoupon
);

// Delete coupon
router.delete("/:id", couponControllers.deleteCoupon);

export const CouponRoutes = router;
