// Order Types
export enum OrderPaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  REJECTED = 'REJECTED',
  CANCELLED ='CANCELLED'
}

export interface OrderResponse {
  data: Order[];
  meta: {
    
  }
}
export interface IShipping {
  shippingLocation: 'dhaka' | 'outside_dhaka';
  shippingCharge: number;
}

export interface ICouponInfo {
  couponId: string;
  code: string;
  discountAmount: number;
  appliedBy?: string;
}

export interface Order {
  _id: string;
  orderInfo: IOrderItem[];
  shipping?: IShipping;
  customerInfo: ICustomerInfo;
  paymentInfo: string;
  totalAmount: number;
  payableAmount?: number;
  trackingCode?: string;
  paymentId?: string;
  paymentStatus?: OrderPaymentStatus;
  coupon?: ICouponInfo;
  orderNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  orderBy: {
    _id: string;
    userId: string;
  };
  shopInfo: IShopInfo;
  vendorId: string;
  productInfo: IProductInfo;
  trackingNumber: string;
  status: string; 
  isCancelled: boolean;
  quantity: number;
  totalAmount: ITotalAmount;
}

export interface IShopInfo {
  _id: string;
  basicInfo: {
    name: string;
    slug: string;
    description: string;
  };
  shopAddress: {
    country: string;
    city: string;
    state: string;
    zip: string;
    streetAddress: string;
  };
}

export interface IProductInfo {
  _id: string;
  vendorId: string;
  shopId: string;
  featuredImg: string;
  gallery: string[];
  video: string;
  brandAndCategories: {
    brand: string;
    categories: string[];
    tags: string[];
  };
  description: {
    name: string;
    slug: string;
    unit: string;
    description: string;
    status: 'publish' | 'draft' | 'archived';
  };
  productType: 'simple' | 'variable' | 'external';
  productInfo: {
    price: number;
    salePrice: number;
    quantity: number;
    sku: string;
    width: string;
    height: string;
    length: string;
    isExternal: boolean;
    external: {
      productUrl: string;
      buttonLabel: string;
    };
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
  specifications: ISpecification[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface ISpecification {
  key?: string;
  value?: string;
}


export interface ITotalAmount {
  subTotal: number;
  tax: number;
  shipping: {
    name: string;
    type: string;
  };
  discount: number;
  total: number;
}

export interface ICustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
