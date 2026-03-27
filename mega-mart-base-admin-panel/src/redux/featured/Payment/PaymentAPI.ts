// PaymentAPI.ts
import { baseApi } from "@/redux/api/baseApi"; // adjust path if needed

interface PayVendorPayload {
  amount: number;
  paymentMethod: string;
  notes?: string;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    payVendor: builder.mutation<PaymentResponse, { vendorId: string }>({
      query: ({ vendorId }) => ({
        url: `/payment/pay-vendor/${vendorId}`,
        method: "POST",
      
      }),
    }),
  }),
});

export const { usePayVendorMutation } = paymentApi;
