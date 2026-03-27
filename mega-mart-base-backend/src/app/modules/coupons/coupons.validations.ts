import { z } from 'zod';

export const createCouponZodSchema = z.object({
  body: z
    .object({
      code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
      description: z.string().optional(),
      type: z.enum(['fixed', 'percentage']),
      discountAmount: z.number().positive('Discount amount must be positive'),
      minimumOrderAmount: z.number().min(0).default(0),
      maximumDiscount: z.number().min(0).optional(),
      isActive: z.boolean().default(true),
      activeDate: z.string().datetime().optional(),
      expireDate: z.string().datetime(),
      usageLimit: z.number().min(0).optional(),
      usedCount: z.number().min(0).default(0),
      userRestriction: z.array(z.string()).optional(),
      productRestriction: z.array(z.string()).optional(),
      ownerType: z.enum(['admin', 'vendor']),
      ownerId: z.string().optional(),
      scope: z.enum(['global', 'shop']),
      shopId: z.string().optional(),
      autoApply: z.boolean().default(false),
      createdBy: z.string().optional(),
    })
    .refine(
      (data) => {
        // If ownerType is vendor, ownerId is required
        if (data.ownerType === 'vendor' && !data.ownerId) {
          return false;
        }
        return true;
      },
      {
        message: 'ownerId is required when ownerType is vendor',
        path: ['ownerId'],
      }
    )
    .refine(
      (data) => {
        // If scope is shop, shopId is required
        if (data.scope === 'shop' && !data.shopId) {
          return false;
        }
        return true;
      },
      {
        message: 'shopId is required when scope is shop',
        path: ['shopId'],
      }
    ),
});

export const updateCouponZodSchema = z.object({
  body: z.object({
    code: z.string().min(3).toUpperCase().optional(),
    description: z.string().optional(),
    type: z.enum(['fixed', 'percentage']).optional(),
    discountAmount: z.number().positive().optional(),
    minimumOrderAmount: z.number().min(0).optional(),
    maximumDiscount: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
    activeDate: z.string().datetime().optional(),
    expireDate: z.string().datetime().optional(),
    usageLimit: z.number().min(0).optional(),
    usedCount: z.number().min(0).optional(),
    userRestriction: z.array(z.string()).optional(),
    productRestriction: z.array(z.string()).optional(),
    ownerType: z.enum(['admin', 'vendor']).optional(),
    ownerId: z.string().optional(),
    scope: z.enum(['global', 'shop']).optional(),
    shopId: z.string().optional(),
    autoApply: z.boolean().optional(),
    createdBy: z.string().optional(),
  }),
});

export const validateCouponZodSchema = z.object({
  body: z.object({
    code: z.string(),
    userId: z.string(),
    orderAmount: z.number().positive(),
    productIds: z.array(z.string()).optional(),
  }),
});
