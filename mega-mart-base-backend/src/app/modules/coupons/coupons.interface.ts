export type TCoupon = {
  code: string;
  description?: string;
  type: 'fixed' | 'percentage';
  discountAmount: number;         // actual discount value
  minimumOrderAmount: number;     // requirement
  maximumDiscount?: number;       // for percentage
  isActive: boolean;              // default: true
  activeDate?: Date;
  expireDate: Date;
  // usage tracking
  usageLimit?: number;
  usedCount?: number;
  // restrictions
  userRestriction?: string[];        // array of userIds
  productRestriction?: string[];     // array of productIds / categories
  // ownership & scope
  ownerType: 'admin' | 'vendor';     // who created the coupon
  ownerId?: string;                  // admin/vendor user id
  scope: 'global' | 'shop';          // global (admin) or shop-specific (vendor)
  shopId?: string;                   // required if scope is 'shop'
  // meta fields
  autoApply?: boolean;               // auto apply if matches
  createdBy?: string;                // admin id
  createdAt?: Date;
  updatedAt?: Date;
};
