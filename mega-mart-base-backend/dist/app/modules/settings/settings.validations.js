"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSiteSettingsZodSchema = void 0;
const zod_1 = require("zod");
exports.updateSiteSettingsZodSchema = zod_1.z.object({
    siteName: zod_1.z.string().optional(),
    siteLogo: zod_1.z.string().url('Invalid site logo URL!').optional(),
    contactEmail: zod_1.z.string().email('Invalid email format!').optional(),
    contactPhone: zod_1.z.string().optional(),
    contactAddress: zod_1.z.string().optional(),
    about: zod_1.z.string().optional(),
    socialLinks: zod_1.z
        .object({
        facebook: zod_1.z.string().url('Invalid Facebook URL!').optional(),
        instagram: zod_1.z.string().url('Invalid Instagram URL!').optional(),
        twitter: zod_1.z.string().url('Invalid Twitter URL!').optional(),
        linkedin: zod_1.z.string().url('Invalid LinkedIn URL!').optional(),
        youtube: zod_1.z.string().url('Invalid YouTube URL!').optional(),
        tiktok: zod_1.z.string().url('Invalid TikTok URL!').optional(),
    })
        .optional(),
    discountBanner: zod_1.z.string().url('Invalid discount banner URL!').optional(),
    appInfoBanner: zod_1.z.string().url('Invalid app info banner URL!').optional(),
});
