"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBannerSchema = exports.createBannerSchema = void 0;
const zod_1 = require("zod");
exports.createBannerSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    subTitle: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    buttonText: zod_1.z.string().optional().nullable(),
    buttonLink: zod_1.z.string().optional().nullable(),
    discount: zod_1.z.preprocess((val) => (val !== undefined && val !== "" ? Number(val) : undefined), zod_1.z.number().optional()),
    isActive: zod_1.z.preprocess((val) => val === "true" || val === true, zod_1.z.boolean()).optional().default(true),
});
exports.updateBannerSchema = exports.createBannerSchema.partial();
