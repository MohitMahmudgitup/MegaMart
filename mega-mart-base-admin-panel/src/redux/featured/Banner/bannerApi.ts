import { baseApi } from "@/redux/api/baseApi";


const bannerApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAllBanners: builder.query<any, void>({
      query: () => ({
        url: '/banner',
        method: 'GET',
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    getSingleBanner: builder.query<any, string>({
      query: id => ({
        url: `/banner/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),

    createBanner: builder.mutation({
      query: formData => ({
        url: '/banner/create',
        method: 'POST',
        body: formData,
      }),
    }),

    updateBanner: builder.mutation<any, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/banner/update/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    deleteBanner: builder.mutation({
      query: (id ) => ({
        url: `/banner/delete/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
    useGetAllBannersQuery,
    useGetSingleBannerQuery,
    useLazyGetSingleBannerQuery,
    useCreateBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation
} = bannerApi;
