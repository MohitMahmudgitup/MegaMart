import { baseApi } from "@/redux/api/baseApi";
import { Order, OrderResponse } from "@/types/Order";
import { IdCard } from "lucide-react";

const orderApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAllOrders: builder.query({
      query: params => ({
        url: '/order',
        method: 'GET',
        params
      }),
      transformResponse: (response: { data: OrderResponse }) => response.data,
    }),
    getSingleOrder: builder.query<Order, string>({
      query: id => ({
        url: `/order/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: { data: Order }) => response.data,
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: newOrder => ({
        url: '/order/create-order',
        method: 'POST',
        body: newOrder,
      }),
      transformResponse: (response: { data: Order }) => response.data,
    }),
    updateStats: builder.mutation({
      query: ({ id, status }: { id: string; status: { status: string } }) => ({
        url: `/order/${id}`,
        method: 'PATCH',
        body: status,
      }),
    }),
    updatetrackCode: builder.mutation({
      query: ({ id, trackCode }: { id: string; trackCode: {trackCode: string} }) => ({
        url: `/order/update/track-code/${id}`,
        method: 'PATCH',
        body: trackCode,
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useCreateOrderMutation,
  useUpdateStatsMutation,
  useUpdatetrackCodeMutation
} = orderApi;
