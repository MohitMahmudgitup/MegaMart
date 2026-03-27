export interface IOrder {
  _id: string;
  orderInfo: {
    customerInfo: string;
    shopInfo: string;
    productInfo: string;
    trackingNumber: string;
    status:
      | 'pending'
      | 'processing'
      | 'at-local-facility'
      | 'out-for-delivery'
      | 'cancelled'
      | 'completed';
    isCancelled: boolean;
    quantity: number;
    totalAmount: {
      subTotal: number;
      tax: number;
      shipping: {
        name: string;
        type: 'amount' | 'percentage';
      };
      discount: number;
      total: number;
    };
    streetAddress: string;
  };
  totalAmount: number;
}


export interface IOrdersState {
  orders: IOrder[];
  singleOrder: IOrder | null;
};