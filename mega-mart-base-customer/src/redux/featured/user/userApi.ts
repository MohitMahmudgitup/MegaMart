import { baseApi } from "@/redux/api/baseApi";

export interface User {
  name: string;
  email: string;
  password: string;
  status?: string;
  orders?: number;
  walletPoint?: number;
  createdAt?: string;
  role?: string;
}

const userApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: '/user',
        method: 'GET',
      }),
      transformResponse: (response: { data: User[] }) => response.data,
    }),
    getSingleUser: builder.query<User, string>({
      query: id => ({
        url: `/user/${id}`,
        method: 'GET',
      }),
    }),
    updateUser: builder.mutation<
      Partial<User>,
      { id: string; newFormData: FormData }
    >({
      query: ({ id, newFormData }) => ({
        url: `/user/${id}`,
        method: 'PATCH',
        body: newFormData,
      }),
    }),
    updateUserRole: builder.mutation({
      query: id => ({
        url: `/user/roleupdate/${id}`,
        method: 'PATCH',
      }),
    }),

    changePassword: builder.mutation<
      { message: string },
      { id: string; oldPassword: string; newPassword: string }
    >({
      query: ({ id, oldPassword, newPassword }) => ({
        url: `/user/change-password/${id}`,
        method: "POST",
        body: { oldPassword, newPassword },
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
  useChangePasswordMutation,
} = userApi;
