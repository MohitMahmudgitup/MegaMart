import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "@/redux/featured/auth/authSlice";
import brandReducer from "@/redux/featured/brand/brandSlice";
import categoryReducer from "@/redux/featured/category/categorySlice";
import customerReducer from "@/redux/featured/customer/customerSlice";
import couponReducer from "@/redux/featured/coupons/couponSlice";

import userReducer from "@/redux/featured/user/userSlice";
import termsReducer from "@/redux/featured/terms/termsSlice";
import shopsReducer from "@/redux/featured/shop/shopSlice";
import productsReducer from "@/redux/featured/product/productSlice";
import orderReducer from "@/redux/featured/order/orderSlice";
import faqReducer from "@/redux/featured/faq/faqSlice";
import dashboardReducer from "@/redux/featured/dashboard/dashboardSlice";
import {
  PERSIST,
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  brand: brandReducer,
  category: categoryReducer,
  customer: customerReducer,
  coupon: couponReducer,
  user: userReducer,
  terms: termsReducer,
  shops: shopsReducer,
  products: productsReducer,
  orders: orderReducer,
  faqs: faqReducer,
  dashboard: dashboardReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "user",
    "brand",
    "category",
    "coupon",
    "customer",
    "terms",
    "products",
    "orders",
    "faqs",
    "dashboard",
  ],
};

const persistedReducers = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [REHYDRATE, PERSIST, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
