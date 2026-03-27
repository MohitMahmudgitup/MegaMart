import { Types } from "mongoose";

export type TShipping = {
  name: string;
  type: "free" | "percentage" | "amount";
};

export type TTotalAmount = {
  subTotal: number;
  tax: number;
  shipping: TShipping;
  discount: number;
  total: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "picked" 
  | "at-local-facility"
  | "out-for-delivery"
  | "delivered"  
  | "cancelled" 
  | "returned" 
  | "refunded" 

export type TCustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};



export type TOrderInfo = {
  orderBy: Types.ObjectId;
  vendorId?: Types.ObjectId;
  shopInfo: Types.ObjectId;
  productInfo: Types.ObjectId;
  color?: string;
  size?: string;
  trackingNumber?: String;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'picked'
    | 'at-local-facility'
    | 'out-for-delivery'
    | 'delivered'
    | 'cancelled'
    | 'returned'
    | 'refunded'
    | 'completed';
  isCancelled: boolean;
  quantity: number;
  totalAmount: TTotalAmount;
};



export enum OrderPaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  REJECTED = 'REJECTED',
  CANCELLED ='CANCELLED'
}

interface IShipping {
  shippingLocation: 'dhaka' | 'outside_dhaka';
  shippingCharge: number;
}

interface ICouponInfo {
  couponId: Types.ObjectId; 
  code: string;
  discountAmount: number; 
  appliedBy?: Types.ObjectId;
}

export type TOrder = {
  orderInfo: TOrderInfo[];
  shipping: IShipping;
  customerInfo: TCustomerInfo;
  paymentInfo: 'pay-with-sslCommerz' | 'cash-on';
  totalAmount: number;
  payableAmount?: number; 
  trackingCode?: string;
  paymentId?: Types.ObjectId;
  paymentStatus?: OrderPaymentStatus;
  coupon?: ICouponInfo
  orderNote?: string;
  createdAt: Date;
};
