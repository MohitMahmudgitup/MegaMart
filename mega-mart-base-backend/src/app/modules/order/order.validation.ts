import { z } from "zod";

// ✅ ObjectId validation
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId");

// ==========================
// ✅ Shipping (per item)
// ==========================
const shippingZodSchema = z.object({
  name: z.string({
    message: "Shipping name is required!",
  }),
  type: z.enum(["free", "percentage", "amount"]),
});

// ==========================
// ✅ Total Amount
// ==========================
const totalAmountZodSchema = z.object({
  subTotal: z.number({
    message: "SubTotal is required!",
  }),
  tax: z.number({
    message: "Tax is required!",
  }),
  shipping: shippingZodSchema,
  discount: z.number({
    message: "Discount is required!",
  }),
  total: z.number({
    message: "Total is required!",
  }),
});

// ==========================
// ✅ Customer Info
// ==========================
const customerInfoZodSchema = z.object({
  firstName: z.string({
    message: "First name is required!",
  }),
  lastName: z.string({
    message: "Last name is required!",
  }),

  // guest friendly
  email: z.string().email().optional().or(z.literal("")),

  phone: z.string({
    message: "Phone number is required!",
  }),
  address: z.string({
    message: "Address is required!",
  }),
  city: z.string({
    message: "City is required!",
  }),
  postalCode: z.string({
    message: "Postal code is required!",
  }),
  country: z.string({
    message: "Country is required!",
  }),
});

// ==========================
// ✅ Payment
// ==========================
const paymentInfoZodSchema = z.enum([
  "cash-on",
  "pay-with-sslCommerz",
]);

// ==========================
// ✅ Main Shipping (checkout)
// ==========================
export const shippingSchema = z.object({
  shippingLocation: z.enum(["dhaka", "outside_dhaka"]),
  shippingCharge: z.number().min(0),
});

// ==========================
// ✅ Order Info (IMPORTANT)
// ==========================
const orderInfoZodSchema = z.object({
  orderBy: objectIdSchema.optional().nullable(),
  shopInfo: objectIdSchema.optional().nullable(),
  productInfo: objectIdSchema,

  color: z.string().optional(),
  size: z.string().optional(),
  trackingNumber: z.string().optional(),

  status: z
    .enum([
      "pending",
      "processing",
      "at-local-facility",
      "out-for-delivery",
      "cancelled",
      "completed",
    ])
    .default("pending"),

  isCancelled: z.boolean().default(false),

  quantity: z.number({
    message: "Quantity is required!",
  }).min(1),

  totalAmount: totalAmountZodSchema,

  orderNote: z.string().optional(),
});

// ==========================
// ✅ FINAL ORDER SCHEMA
// ==========================
export const createOrderZodSchema = z.object({
  orderInfo: z
    .array(orderInfoZodSchema)
    .min(1, "At least one order info is required!"),

  shipping: shippingSchema,

  customerInfo: customerInfoZodSchema,

  paymentInfo: paymentInfoZodSchema,

  totalAmount: z.number({
    message: "Total amount is required!",
  }),

  // ✅ optional flags
  isGuest: z.boolean().optional(),
});