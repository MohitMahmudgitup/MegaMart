import { baseApi } from '@/redux/api/baseApi';
import { ISetting } from '@/types/setting';

export  const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query<ISetting[], void>({
            query: () => ({
                url: '/setting',
                method: 'GET',
            }),
             transformResponse: (response: { success: boolean; data: ISetting[] }) => response.data,
        }),
    }),
});


export const { useGetSettingsQuery } = settingsApi;
