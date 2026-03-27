import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TCoupon = {
  image: string;
  code: string;
  description: string;
  type: "fixed" | "percentage";
  discountAmount: number;
  isVerifiedCustomer?: boolean;
  isApproved?: boolean;
  activeDate: string;
  expireDate: string;
};

type TCouponState = {
  coupons: TCoupon[];
};

const initialState: TCouponState = {
  coupons: [],
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    setCoupons: (state, action) => {
      state.coupons = action.payload;
    },
    clearCoupons: (state) => {
      state.coupons = [];
    },
  },
});

export const { setCoupons, clearCoupons } = couponSlice.actions;

export const selectCoupons = (state: RootState) => state.coupon.coupons;

export default couponSlice.reducer;
