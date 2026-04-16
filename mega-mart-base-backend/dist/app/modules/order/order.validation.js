"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderZodSchema = exports.shippingSchema = void 0;
const zod_1 = require("zod");
// ✅ ObjectId validation
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId");
// ==========================
// ✅ Shipping (per item)
// ==========================
const shippingZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        message: "Shipping name is required!",
    }),
    type: zod_1.z.enum(["free", "percentage", "amount"]),
});
// ==========================
// ✅ Total Amount
// ==========================
const totalAmountZodSchema = zod_1.z.object({
    subTotal: zod_1.z.number({
        message: "SubTotal is required!",
    }),
    tax: zod_1.z.number({
        message: "Tax is required!",
    }),
    shipping: shippingZodSchema,
    discount: zod_1.z.number({
        message: "Discount is required!",
    }),
    total: zod_1.z.number({
        message: "Total is required!",
    }),
});
// ==========================
// ✅ Customer Info
// ==========================
const customerInfoZodSchema = zod_1.z.object({
    firstName: zod_1.z.string({
        message: "First name is required!",
    }),
    lastName: zod_1.z.string({
        message: "Last name is required!",
    }),
    // guest friendly
    email: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    phone: zod_1.z.string({
        message: "Phone number is required!",
    }),
    address: zod_1.z.string({
        message: "Address is required!",
    }),
    city: zod_1.z.string({
        message: "City is required!",
    }),
    postalCode: zod_1.z.string({
        message: "Postal code is required!",
    }),
    country: zod_1.z.string({
        message: "Country is required!",
    }),
});
// ==========================
// ✅ Payment
// ==========================
const paymentInfoZodSchema = zod_1.z.enum([
    "cash-on",
    "pay-with-sslCommerz",
]);
// ==========================
// ✅ Main Shipping (checkout)
// ==========================
exports.shippingSchema = zod_1.z.object({
    shippingLocation: zod_1.z.enum(["dhaka", "outside_dhaka"]),
    shippingCharge: zod_1.z.number().min(0),
});
// ==========================
// ✅ Order Info (IMPORTANT)
// ==========================
const orderInfoZodSchema = zod_1.z.object({
    orderBy: objectIdSchema.optional().nullable(),
    shopInfo: objectIdSchema.optional().nullable(),
    productInfo: objectIdSchema,
    color: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
    trackingNumber: zod_1.z.string().optional(),
    status: zod_1.z
        .enum([
        "pending",
        "processing",
        "at-local-facility",
        "out-for-delivery",
        "cancelled",
        "completed",
    ])
        .default("pending"),
    isCancelled: zod_1.z.boolean().default(false),
    quantity: zod_1.z.number({
        message: "Quantity is required!",
    }).min(1),
    totalAmount: totalAmountZodSchema,
    orderNote: zod_1.z.string().optional(),
});
// ==========================
// ✅ FINAL ORDER SCHEMA
// ==========================
exports.createOrderZodSchema = zod_1.z.object({
    orderInfo: zod_1.z
        .array(orderInfoZodSchema)
        .min(1, "At least one order info is required!"),
    shipping: exports.shippingSchema,
    customerInfo: customerInfoZodSchema,
    paymentInfo: paymentInfoZodSchema,
    totalAmount: zod_1.z.number({
        message: "Total amount is required!",
    }),
    // ✅ optional flags
    isGuest: zod_1.z.boolean().optional(),
});
