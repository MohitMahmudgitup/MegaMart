"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const coupons_controller_1 = require("./coupons.controller");
const router = express_1.default.Router();
// Get all coupons
router.get("/", coupons_controller_1.couponControllers.getAllCoupons);
// Get coupon by code
router.get("/code/:code", coupons_controller_1.couponControllers.getCouponByCode);
// Get single coupon by ID
router.get("/:id", coupons_controller_1.couponControllers.getSingleCoupon);
// Create coupon
router.post("/create-coupon", 
// validateRequest(createCouponZodSchema),
coupons_controller_1.couponControllers.createCoupon);
// Validate coupon for order
router.post("/validate", 
// validateRequest(validateCouponZodSchema),
coupons_controller_1.couponControllers.validateCoupon);
// Apply coupon (increment usage count)
router.patch("/apply/:id", coupons_controller_1.couponControllers.applyCoupon);
// Update coupon
router.patch("/:id", 
// validateRequest(updateCouponZodSchema),
coupons_controller_1.couponControllers.updateCoupon);
// Delete coupon
router.delete("/:id", coupons_controller_1.couponControllers.deleteCoupon);
exports.CouponRoutes = router;
