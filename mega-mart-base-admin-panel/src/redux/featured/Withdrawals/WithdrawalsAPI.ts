import { baseApi } from "@/redux/api/baseApi";
import type { WithdrawalsResponse, Withdrawal } from "@/types/Withdrawals";

const withdrawalsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createWithdrawal: builder.mutation<Withdrawal, Partial<Withdrawal>>({
      query: data => ({
        url: '/withdrawals',
        method: 'POST',
        body: data,
      }),
    }),

    getWithdrawals: builder.query<Withdrawal[], void>({
      query: () => ({
        url: '/withdrawals',
        method: 'GET',
      }),
      transformResponse: (response: WithdrawalsResponse) => response.data,
    }),

    getWithdrawalById: builder.query<Withdrawal[], string>({
      query: id => ({
        url: `/withdrawals/vendor/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: WithdrawalsResponse) => response.data,
    }),

    deleteWithdrawal: builder.mutation<Withdrawal, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/withdrawals/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
    updateWithdraw: builder.mutation({
      query: ({ id, status }: { id: string; status: { status: string } }) => ({
        url: `/withdrawals/update/${id}`,
        method: 'PATCH',
        body: status,
      }),
    }),
  }),
});

export const {
  useCreateWithdrawalMutation,
  useGetWithdrawalsQuery,
  useGetWithdrawalByIdQuery,
  useDeleteWithdrawalMutation,
  useUpdateWithdrawMutation
} = withdrawalsApi;

export default withdrawalsApi;
