// coupons.model.ts
import { Schema, model } from 'mongoose';
import { TCoupon } from './coupons.interface';

const couponSchema = new Schema<TCoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required!'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['fixed', 'percentage'],
      required: [true, 'Type is required!'],
    },
    discountAmount: {
      type: Number,
      required: [true, 'Discount amount is required!'],
      min: [0, 'Discount amount must be positive!'],
    },
    minimumOrderAmount: {
      type: Number,
      required: [true, 'Minimum order amount is required!'],
      default: 0,
      min: [0, 'Minimum order amount must be positive!'],
    },
    maximumDiscount: {
      type: Number,
      default: 0,
      min: [0, 'Maximum discount must be positive!'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    activeDate: {
      type: Date,
    },
    expireDate: {
      type: Date,
      required: [true, 'Expire date is required!'],
    },
    usageLimit: {
      type: Number,
      default: 0,
      min: [0, 'Usage limit must be positive!'],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, 'Used count must be positive!'],
    },
    userRestriction: {
      type: [String],
      default: [],
    },
    productRestriction: {
      type: [String],
      default: [],
    },
    ownerType: {
      type: String,
      enum: ['admin', 'vendor'],
      required: [true, 'Owner type is required!'],
    },
    ownerId: {
      type: String,
    },
    scope: {
      type: String,
      enum: ['global', 'shop'],
      required: [true, 'Scope is required!'],
    },
    shopId: {
      type: String,
    },
    autoApply: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, expireDate: 1 });
couponSchema.index({ ownerType: 1, scope: 1 });
couponSchema.index({ shopId: 1 });

export const CouponModel = model<TCoupon>('Coupon', couponSchema);
