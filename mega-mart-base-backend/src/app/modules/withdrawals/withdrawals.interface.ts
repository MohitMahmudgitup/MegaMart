import { Types } from "mongoose";

// Enums
export enum PaymentStatus {
  Approved = 'approved',
  OnHold = 'on-hold',
  Processing = 'processing',
  Pending = 'pending',
  Rejected = 'rejected',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  Bikash = 'bikash',
  Visa = 'visa',
  Bank = 'bank',
}

export type TVisa = {
  cardNumber: number;
  cardName: string;
};

export interface TWithdrawals extends Document {
  vendorId: Types.ObjectId;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  number?: number;
  visa?: TVisa;
  payment?: Types.ObjectId;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
