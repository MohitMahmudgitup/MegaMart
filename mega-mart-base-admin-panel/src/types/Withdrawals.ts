export interface VendorSummary {
  totalRevenue: number;
  todaysRevenue: number;
  todaysRefund: number;
  totalShop: number;
}

export interface VendorOrderStatus {
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
}

export interface Vendor {
  _id: string;
  userId: string;
  shops: any | null;
  shopTransfer: any[];
  messages: any[];
  storeNotices: any[];
  summery: VendorSummary;
  orderStatus: VendorOrderStatus;
  status: string;
  salesHistory: any[];
  topCategoryByProducts: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VisaInfo {
  cardNumber: number;
  cardName: string;
}

export interface Withdrawal {
  _id: string;
  vendorId: Vendor;
  amount: number;
  cardName?: string;
  paymentMethod: "visa" | "bikash" | "bkash" | string;
  status: "pending" | "approved" | "rejected" | string;
  visa?: VisaInfo;
  number?: string;
  payment?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WithdrawalsResponse {
  success: boolean;
  message: string;
  data: Withdrawal[];
}
