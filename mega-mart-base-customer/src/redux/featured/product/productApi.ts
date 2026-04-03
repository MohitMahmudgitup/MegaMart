import { baseApi } from "@/redux/api/baseApi";
import { IProduct } from "@/types/product";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBestSellingProducts: builder.query({
      query: (params) => ({
        url: "/product/best-selling-products",
        method: "GET",
        params,
      }),
      transformResponse: (response: { data: IProduct[] }) => response.data,
    }),
    getAllProducts: builder.query<any, { limit?: number; page?: number }>({
      query: (params) => ({
        url: "/product",
        method: "GET",
        params, // sends ?limit=1000&page=1 etc.
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    getAllProductsbyCategoryName: builder.query<any, { id?: string }>({
      query: ({ id }) => ({
        url: `/product/category/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    getSingleProduct: builder.query<any, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/product/create-product",
        method: "POST",
        body: data,
      }),
    }),
    updateProduct: builder.mutation<any, { id: string; body: any }>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "PATCH",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    newArrivalsListData: builder.query<any, void>({
      query: () => ({
        url: "/product/type/new-arrivals",
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    productcollections: builder.query<any, void>({
      query: () => ({
        url: "/product/type/product-collection",
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

  }),
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useLazyGetSingleProductQuery,
  useCreateProductMutation,
  useGetAllProductsbyCategoryNameQuery,
  useGetBestSellingProductsQuery,
  useLazyGetBestSellingProductsQuery,
  useNewArrivalsListDataQuery,
  useProductcollectionsQuery,

} = productApi;
