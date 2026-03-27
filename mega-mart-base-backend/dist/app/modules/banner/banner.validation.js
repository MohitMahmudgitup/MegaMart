"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBannerSchema = exports.createBannerSchema = void 0;
const zod_1 = require("zod");
exports.createBannerSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'title is required'),
    subTitle: zod_1.z.string().min(1, 'subTitle is required'),
    image: zod_1.z.string().url('image must be a valid URL').optional(),
    buttonText: zod_1.z.string().optional().nullable(),
    buttonLink: zod_1.z.string().optional().nullable(),
    discount: zod_1.z.number(),
    isActive: zod_1.z.boolean().optional().default(true),
});
exports.updateBannerSchema = exports.createBannerSchema.partial();
