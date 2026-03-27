"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCouponZodSchema = exports.updateCouponZodSchema = exports.createCouponZodSchema = void 0;
const zod_1 = require("zod");
exports.createCouponZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        code: zod_1.z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
        description: zod_1.z.string().optional(),
        type: zod_1.z.enum(['fixed', 'percentage']),
        discountAmount: zod_1.z.number().positive('Discount amount must be positive'),
        minimumOrderAmount: zod_1.z.number().min(0).default(0),
        maximumDiscount: zod_1.z.number().min(0).optional(),
        isActive: zod_1.z.boolean().default(true),
        activeDate: zod_1.z.string().datetime().optional(),
        expireDate: zod_1.z.string().datetime(),
        usageLimit: zod_1.z.number().min(0).optional(),
        usedCount: zod_1.z.number().min(0).default(0),
        userRestriction: zod_1.z.array(zod_1.z.string()).optional(),
        productRestriction: zod_1.z.array(zod_1.z.string()).optional(),
        ownerType: zod_1.z.enum(['admin', 'vendor']),
        ownerId: zod_1.z.string().optional(),
        scope: zod_1.z.enum(['global', 'shop']),
        shopId: zod_1.z.string().optional(),
        autoApply: zod_1.z.boolean().default(false),
        createdBy: zod_1.z.string().optional(),
    })
        .refine((data) => {
        // If ownerType is vendor, ownerId is required
        if (data.ownerType === 'vendor' && !data.ownerId) {
            return false;
        }
        return true;
    }, {
        message: 'ownerId is required when ownerType is vendor',
        path: ['ownerId'],
    })
        .refine((data) => {
        // If scope is shop, shopId is required
        if (data.scope === 'shop' && !data.shopId) {
            return false;
        }
        return true;
    }, {
        message: 'shopId is required when scope is shop',
        path: ['shopId'],
    }),
});
exports.updateCouponZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string().min(3).toUpperCase().optional(),
        description: zod_1.z.string().optional(),
        type: zod_1.z.enum(['fixed', 'percentage']).optional(),
        discountAmount: zod_1.z.number().positive().optional(),
        minimumOrderAmount: zod_1.z.number().min(0).optional(),
        maximumDiscount: zod_1.z.number().min(0).optional(),
        isActive: zod_1.z.boolean().optional(),
        activeDate: zod_1.z.string().datetime().optional(),
        expireDate: zod_1.z.string().datetime().optional(),
        usageLimit: zod_1.z.number().min(0).optional(),
        usedCount: zod_1.z.number().min(0).optional(),
        userRestriction: zod_1.z.array(zod_1.z.string()).optional(),
        productRestriction: zod_1.z.array(zod_1.z.string()).optional(),
        ownerType: zod_1.z.enum(['admin', 'vendor']).optional(),
        ownerId: zod_1.z.string().optional(),
        scope: zod_1.z.enum(['global', 'shop']).optional(),
        shopId: zod_1.z.string().optional(),
        autoApply: zod_1.z.boolean().optional(),
        createdBy: zod_1.z.string().optional(),
    }),
});
exports.validateCouponZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string(),
        userId: zod_1.z.string(),
        orderAmount: zod_1.z.number().positive(),
        productIds: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
