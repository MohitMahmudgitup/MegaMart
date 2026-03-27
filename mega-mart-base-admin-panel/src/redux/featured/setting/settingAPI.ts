import { baseApi } from '@/redux/api/baseApi';
import { ISetting } from '@/types/setting';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<ISetting[], void>({
      query: () => ({
        url: '/setting',
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; data: ISetting[] }) =>
        response.data,
    }),

    updateSettings: builder.mutation<ISetting, { id: string; formData: Partial<ISetting> }>({
      query: ({ id, formData }) => ({
        url: `/setting/${id}`,
        method: 'PATCH',
        body: formData,
      }),
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
