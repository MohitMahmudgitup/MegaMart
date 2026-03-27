import { baseApi } from "@/redux/api/baseApi";

const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query<any, void>({
      query: () => ({
        url: "/banner",
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    getSingleBanner: builder.query<any, string>({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    createBanner: builder.mutation<any, any>({
      query: (data) => ({
        url: "/banner/create-banner",
        method: "POST",
        body: data,
      }),
    }),

    updateBanner: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/banner/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    
    getProductsByBrand: builder.query<any, string>({
      query: (brandId) => ({
        url: `/brand/products/${brandId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

  }),
});

export const {
  useGetAllBannersQuery,
  useGetSingleBannerQuery,
  useLazyGetSingleBannerQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useGetProductsByBrandQuery,
} = bannerApi;
