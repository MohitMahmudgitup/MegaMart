import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { IOrder, IOrdersState } from '@/types/order';




const initialState: IOrdersState = {
  orders: [],
  singleOrder: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<IOrder[]>) => {
      state.orders = action.payload;
    },
    setSingleOrder: (state, action: PayloadAction<IOrder>) => {
      state.singleOrder = action.payload;
    }
  },
});

export const { setOrders, setSingleOrder } = orderSlice.actions;

// selectors
export const selectAllOrders = (state: RootState) => state.orders.orders;
export const selectSingleOrder = (state: RootState) => state.orders.singleOrder;

export default orderSlice.reducer;
