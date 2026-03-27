import { baseApi } from '@/redux/api/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    loginUser: builder.mutation({
      query: data => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    registerUser: builder.mutation({
      query: data => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, string>({
      query: userId => ({
        url: `/auth/logout/${userId}`,
        method: 'POST',
        credentials: 'include',
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/user/forget-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({
        token,
        password,
      }: {
        token: string;
        password: string;
      }) => ({
        url: `/user/reset-password/${token}`,
        method: "POST",
        body: { password },
      }),
    }),

  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutMutation,
  useGetMeQuery,
  useForgetPasswordMutation,
  useResetPasswordMutation,
} = authApi;


