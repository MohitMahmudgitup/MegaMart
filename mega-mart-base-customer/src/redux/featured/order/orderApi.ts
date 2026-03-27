import { baseApi } from "@/redux/api/baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAllOrders: builder.query<any, void>({
      query: () => ({
        url: '/order',
        method: 'GET',
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    createOrder: builder.mutation({
      query: data => ({
        url: '/order/create-order',
        method: 'POST',
        body: data,
      }),
    }),
    getSingleOrder: builder.query<any, string>({
      query: id => ({
        url: `/order/${id}`,
        method: 'GET',
      }),
    }),
    getMyOrders: builder.query({
      query: ({ id, params }) => ({
        url: `/order/my-order/${id}`,
        method: 'GET',
        params,
      }),
    }),
    cancelOrder: builder.mutation({
      query: id => ({
        url: `/order/cancel/${id}`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useCancelOrderMutation
} = orderApi;
