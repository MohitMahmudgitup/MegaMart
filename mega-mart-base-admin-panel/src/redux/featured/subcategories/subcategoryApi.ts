// src/redux/api/subcategoryApi.ts
import { baseApi } from '@/redux/api/baseApi';
import { TSubCategory } from '@/types/SubCategory';

// Inject endpoints for subcategories
export const subCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET all subcategories
        getAllSubCategories: builder.query<TSubCategory[], void>({
            query: () => ({
                url: '/subcategory', // matches your backend route
                method: 'GET',
            }),
            transformResponse: (response: { data: TSubCategory[] }) => response.data,
        }),

        getSubCategoryById: builder.query<TSubCategory, string>({
            query: (id) => ({
                url: `/subcategory/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: { data: TSubCategory }) => response.data,
        }),

        createSubCategory: builder.mutation<TSubCategory, Partial<TSubCategory>>({
            query: (body) => {
                // If you're sending images as multipart/form-data:
                const formData = new FormData();
                Object.entries(body).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as any);
                    }
                });
                return {
                    url: '/subcategory/create-subcategory',
                    method: 'POST',
                    body: formData, 
                };
            },
        }),
    }),
});

// Export hooks for usage in React components
export const {
    useGetAllSubCategoriesQuery,
    useGetSubCategoryByIdQuery,
    useCreateSubCategoryMutation,
} = subCategoryApi;