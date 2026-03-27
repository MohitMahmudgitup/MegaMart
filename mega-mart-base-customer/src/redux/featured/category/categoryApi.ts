import { baseApi } from "@/redux/api/baseApi";

const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query<any, void>({
      query: () => ({
        url: "/category",
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category/create-category",
        method: "POST",
        body: data,
      }),
    }),
    getSingleCategory: builder.query<any, string>({
      query: (slug) => ({
        url: `/category/${slug}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useGetSingleCategoryQuery,
  useCreateCategoryMutation,
} = shopApi;
