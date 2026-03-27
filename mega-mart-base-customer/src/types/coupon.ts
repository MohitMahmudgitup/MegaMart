export interface ICoupon {
  _id: string;
  code: string;
  description: string;
  type: "fixed" | "percentage";
  discountAmount: number;
  minimumOrderAmount: number;
  maximumDiscount: number;
  isActive: boolean;

  activeDate: string;
  expireDate: string;

  usageLimit: number;
  usedCount: number;

  userRestriction: string[];  
  productRestriction: string[]; 

  ownerType: "vendor" | "admin" | "super_admin";
  ownerId: string;

  scope: "shop" | "global";
  shopId?: string;

  autoApply: boolean;

  createdAt: string;
  updatedAt: string;
}
