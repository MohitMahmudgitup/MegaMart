import { baseApi } from '@/redux/api/baseApi';
import { IVendor } from '@/types/vendor';

const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new vendor
    createVendor: builder.mutation<IVendor, Partial<IVendor>>({
      query: (data) => ({
        url: '/vendor/create-vendor',
        method: 'POST',
        body: data,
      }),
    }),

    // Get all vendors
    getVendors: builder.query<IVendor[], void>({
      query: () => ({
        url: '/vendor',
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; message: string; data: IVendor[] }) =>
        response.data,
    }),

    // Get a single vendor by ID
    getVendorById: builder.query<any , string>({
      query: (id) => ({
        url: `/vendor/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; message: string; data: IVendor }) =>
        response.data,
    }),
    getVendorByUserId: builder.query<any , string>({
      query: (id) => ({
        url: `/vendor/user/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; message: string; data: IVendor }) =>
        response.data,
    }),
      updateVendorStatus: builder.mutation<IVendor, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/vendor/status-update/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (response: { success: boolean; message: string; data: IVendor }) =>
        response.data,
    }),
    
  }),
});

export const {
  useCreateVendorMutation,
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useGetVendorByUserIdQuery,
  useUpdateVendorStatusMutation,
} = vendorApi;
