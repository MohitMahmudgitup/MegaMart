import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { ICustomer } from '@/types/customer';

type TCustomerState = {
  customer: ICustomer | null;
};

const initialState: TCustomerState = {
  customer: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer: (state, action: PayloadAction<ICustomer>) => {
      state.customer = action.payload;
    },
    clearCustomer: state => {
      state.customer = null;
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; type: 'inc' | 'dec' }>
    ) => {
      if (!state.customer) return;

      const { productId, type } = action.payload;

      state.customer.cartItem[0].productInfo =
        state.customer.cartItem[0].productInfo.map(item => {
          const ids = item.productId.map(p =>
            typeof p === 'string' ? p : p._id
          );
          if (ids.includes(productId)) {
            const newQuantity =
              type === 'inc'
                ? item.quantity + 1
                : Math.max(item.quantity - 1, 1);
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
    },
  },
});

export const { setCustomer, clearCustomer, updateCartItemQuantity } = customerSlice.actions;

export const selectCustomer = (state: RootState) => state.customer.customer;

export default customerSlice.reducer;
