import { baseApi } from "@/redux/api/baseApi";

export interface Coupon {
    _id?: string;
    code: string;
    description?: string;
    type: "fixed" | "percentage";
    discountAmount: number;
    minimumOrderAmount: number;
    maximumDiscount?: number;
    isActive: boolean;
    activeDate?: string;
    expireDate: string;
    usageLimit?: number;
    usedCount?: number;
    userRestriction?: string[];
    productRestriction?: string[];
    ownerType: "admin" | "vendor";
    ownerId?: string;
    scope: "global" | "shop";
    shopId?: string;
    autoApply?: boolean;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ValidateCouponRequest {
    code: string;
    userId: string;
    orderAmount: number;
    productIds?: string[];
}

export interface ValidateCouponResponse {
    coupon: Coupon;
    discountValue: number;
    finalAmount: number;
}

const couponApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all coupons
        getAllCoupons: builder.query<Coupon[], void>({
            query: () => ({
                url: "/coupon",
                method: "GET",
            }),
            transformResponse: (response: { data: Coupon[] }) => response.data,
        }),

        // Get single coupon by ID
        getSingleCoupon: builder.query<Coupon, string>({
            query: (id) => ({
                url: `/coupon/${id}`,
                method: "GET",
            }),
            transformResponse: (response: { data: Coupon }) => response.data,
        }),

        // Get coupon by code
        getCouponByCode: builder.query<Coupon, string>({
            query: (code) => ({
                url: `/coupon/code/${code}`,
                method: "GET",
            }),
            transformResponse: (response: { data: Coupon }) => response.data,
        }),

        // Create a new coupon
        createCoupon: builder.mutation<Coupon, Partial<Coupon>>({
            query: (formData) => ({
                url: "/coupon/create-coupon",
                method: "POST",
                body: formData,
            }),
            transformResponse: (response: { data: Coupon }) => response.data,

        }),

        // Update an existing coupon
        updateCoupon: builder.mutation<Coupon, { id: string; formData: Partial<Coupon> }>({
            query: ({ id, formData }) => ({
                url: `/coupon/${id}`,
                method: "PATCH",
                body: formData,
            }),
            transformResponse: (response: { data: Coupon }) => response.data,
        }),

        // Delete a coupon
        deleteCoupon: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/coupon/${id}`,
                method: "DELETE",
            }),
        }),

        // Validate coupon for order
        validateCoupon: builder.mutation<ValidateCouponResponse, ValidateCouponRequest>({
            query: (data) => ({
                url: "/coupon/validate",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: { data: ValidateCouponResponse }) => response.data,
        }),

        // Apply coupon (increment usage count)
        applyCoupon: builder.mutation<Coupon, string>({
            query: (id) => ({
                url: `/coupon/apply/${id}`,
                method: "PATCH",
            }),
            transformResponse: (response: { data: Coupon }) => response.data,
        }),
    }),
});

export const {
    useGetAllCouponsQuery,
    useGetSingleCouponQuery,
    useGetCouponByCodeQuery,
    useLazyGetCouponByCodeQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useValidateCouponMutation,
    useApplyCouponMutation,
} = couponApi;
