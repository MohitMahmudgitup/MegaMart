import { baseApi } from "@/redux/api/baseApi";
import { IBrand } from "@/types/brands";

const brandsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query<IBrand[], void>({
      query: () => ({
        url: "/brand",
        method: "GET",
      }),
      transformResponse: (response: { data: IBrand[] }) => response.data,
    }),

    getSingleBrand: builder.query<IBrand, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: IBrand }) => response.data,
    }),

    createBrand: builder.mutation<IBrand, Partial<IBrand>>({
      query: (formData) => ({
        url: "/brand/create-brand",
        method: "POST",
          body: formData, 
      }),
      transformResponse: (response: { data: IBrand }) => response.data,
    }),
     updateBrand: builder.mutation<IBrand, { id: string; formData: Partial<IBrand> }>({
      query: ({ id, formData }) => ({
        url: `/brand/update-brand/${id}`,
        method: "PATCH",
        body: formData,
      }),
      transformResponse: (response: { data: IBrand }) => response.data,
    }),
    deleteBrand: builder.mutation<IBrand, string>({
      query: (id) => ({
        url: `/brand/delete/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: IBrand }) => response.data,
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useGetSingleBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
