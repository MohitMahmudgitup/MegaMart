import { baseApi } from "@/redux/api/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    payOrder: builder.mutation({
      query: (orderId: string) => ({
        url: `/payment/pay/${orderId}`,
        method: "POST",
      }),
    }),
    retryPayment: builder.mutation({
      query: (paymentId: string) => ({
        url: `/payment/payments/retry/${paymentId}`,
        method: "POST",
      }),
    }),
  }),
});

export const { usePayOrderMutation, useRetryPaymentMutation } = paymentApi;
