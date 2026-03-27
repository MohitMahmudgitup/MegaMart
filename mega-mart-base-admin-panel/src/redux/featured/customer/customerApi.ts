/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from '@/redux/api/baseApi';
import { ICustomer } from '@/types/Customer';

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query<ICustomer[], void>({
      query: () => ({
        url: '/customer',
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; message: string; data: ICustomer[] }) => response.data,
    }),

    getSingleCustomer: builder.query<ICustomer, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; message: string; data: ICustomer }) => response.data,
    }),

    createCustomer: builder.mutation<ICustomer, Partial<ICustomer>>({
      query: (newCustomer) => ({
        url: '/customer/create-customer',
        method: 'POST',
        body: newCustomer,
      }),
      transformResponse: (response: { success: boolean; message: string; data: ICustomer }) => response.data,
    }),

    editCustomer: builder.mutation<ICustomer, { id: string; updateDetails: Partial<ICustomer> }>({
      query: ({ id, updateDetails }) => ({
        url: `/customer/edit-customer/${id}`,
        method: 'PATCH',
        body: updateDetails,
      }),
      transformResponse: (response: { success: boolean; message: string; data: ICustomer }) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCustomersQuery,
  useGetSingleCustomerQuery,
  useCreateCustomerMutation,
  useEditCustomerMutation,
} = customerApi;
