"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBrandZodSchema = exports.updateiconSchema = exports.updateimageItemSchema = exports.createBrandZodSchema = exports.imageItemSchema = exports.iconSchema = void 0;
const zod_1 = require("zod");
exports.iconSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Icon name is required!" : "Not a string!",
    }),
});
exports.imageItemSchema = zod_1.z.object({
    layout: zod_1.z
        .enum(["grid", "slider"])
        .refine((val) => ["grid", "slider"].includes(val), {
        message: "View type must be either 'grid' or 'slider'",
    }),
    image: zod_1.z
        .string({
        error: (issue) => issue.input === undefined ? "Image is required!" : "Not a string!",
    })
        .url("Invalid image URL!"),
});
exports.createBrandZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        error: (issue) => issue.input === undefined ? "Brand name is required!" : "Not a string!",
    }),
    icon: exports.iconSchema,
});
exports.updateimageItemSchema = zod_1.z.object({
    layout: zod_1.z
        .enum(['grid', 'slider'])
        .refine(val => ['grid', 'slider'].includes(val), {
        message: "View type must be either 'grid' or 'slider'",
    }).optional(),
    image: zod_1.z
        .string()
        .url('Invalid image URL!').optional(),
});
exports.updateiconSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    url: zod_1.z
        .string()
        .url('Invalid icon URL!').optional(),
});
exports.updateBrandZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    icon: exports.updateiconSchema.optional(),
    images: exports.updateimageItemSchema.optional(),
});
