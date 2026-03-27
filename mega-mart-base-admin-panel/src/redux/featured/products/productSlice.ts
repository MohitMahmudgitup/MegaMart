import { RootState } from '@/redux/store';
import { IProduct } from '@/types/Product';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TProductState = {
  products: IProduct[];
  singleProduct: IProduct | null;
};

const initialState: TProductState = {
  products: [],
  singleProduct: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.products = action.payload;
    },
    setSingleProduct: (state, action: PayloadAction<IProduct>) => {
      state.singleProduct = action.payload;
    },
  },
});

export const { setProducts, setSingleProduct} =
  productSlice.actions;

// selectors
export const selectProducts = (state: RootState) => state?.products?.products;
export const selectSingleProduct = (state: RootState) =>
  state.products.singleProduct;

export default productSlice.reducer;
