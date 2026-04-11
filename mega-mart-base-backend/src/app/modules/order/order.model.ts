import { Schema, model } from 'mongoose';
import {
  TOrder,
  TOrderInfo,
  TTotalAmount,
  TCustomerInfo,
} from './order.interface';
import { TShipping } from '../transactions/transactions.interface';

// Shipping Schema
const shippingSchema = new Schema<TShipping>(
  {
    name: {
      type: String,
      required: [true, 'Shipping name is required!'],
    },
    type: {
      type: String,
      enum: ['free', 'percentage', 'amount'],
      required: [true, 'Shipping type is required!'],
    },
  },
  { _id: false }
);

// Total Amount Schema
const totalAmountSchema = new Schema<TTotalAmount>(
  {
    subTotal: {
      type: Number,
      required: [true, 'SubTotal is required!'],
    },
    tax: {
      type: Number,
      required: [true, 'Tax is required!'],
    },
    shipping: {
      type: shippingSchema,
      required: [true, 'Shipping info is required!'],
    },
    discount: {
      type: Number,
      required: [true, 'Discount is required!'],
    },
    total: {
      type: Number,
      required: [true, 'Total is required!'],
    },
  },
  { _id: false }
);

// Customer Info Schema
const customerInfoSchema = new Schema<TCustomerInfo>(
  {
    firstName: { type: String},
    lastName: { type: String  },
    email: { type: String },
    phone: { type: String, required: [true, 'Phone number is required!'] },
    address: { type: String, required: [true, 'Address is required!'] },
    city: { type: String, required: [true, 'City is required!'] },
    postalCode: { type: String, required: [true, 'Postal code is required!'] },
    country: { type: String, required: [true, 'Country is required!'] },
  },
  { _id: false }
);



// Order Info Schema
const orderInfoSchema = new Schema<TOrderInfo>(
  {
    orderBy: {
      type: Schema.Types.ObjectId,
      ref: 'customer',
      required: true,
    },
    shopInfo: {
      type: Schema.Types.ObjectId,
      ref: 'shop',
      required: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'vendor',
    },
    productInfo: {
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },
    color: {type: String},
    size: {
      type: String,
    },
    trackingNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending','confirmed','processing','picked','at-local-facility','out-for-delivery','delivered','cancelled','returned','refunded'],
      required: true,
      default: 'pending',
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: totalAmountSchema,
      required: true,
    },
  },
  { _id: false }
);

const ShippingSchema = new Schema(
  {
    shippingLocation: {
      type: String,
      enum: ['dhaka', 'outside_dhaka'],
      required: true,
    },
    shippingCharge: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);


const couponInfoSchema = new Schema(
  {
    couponId: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    code: {
      type: String,
    },
    discountAmount: {
      type: Number,
    },
    appliedBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { _id: false }
);

// Main Order Schema
const orderSchema = new Schema<TOrder>(
  {
    orderInfo: {
      type: [orderInfoSchema],
      required: true,
    },
    shipping: {
      type: ShippingSchema,
    },
    customerInfo: {
      type: customerInfoSchema,
      required: true,
    },
    paymentInfo: {
      type: String,
      enum: ['pay-with-sslCommerz', 'cash-on'],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    payableAmount: {
      type: Number,
      required: true,
    },
    paymentId: { type: Schema.Types.ObjectId, ref: 'payment' },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'UNPAID', 'REJECTED', 'CANCELLED'],
    },
    coupon: couponInfoSchema,
    orderNote: { type: String },
    trackingCode: { type: String },
  },
  { timestamps: true }
);

export const OrderModel = model<TOrder>('order', orderSchema);
