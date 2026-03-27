import { baseApi } from "@/redux/api/baseApi";
import { VendorStatsResponse } from "@/types/VendorStatsResponse";

export const vendordashboardsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getVendorStats: builder.query({
   query: (vendorId) => ({
    url: `/stats/vendor/${vendorId}`,
    method: "GET",
      }),
        transformResponse: (response: VendorStatsResponse) => response.data
    }),
  }),
});

export const { useGetVendorStatsQuery } = vendordashboardsApi;