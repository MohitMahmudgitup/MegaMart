"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettingsModel = void 0;
const mongoose_1 = require("mongoose");
const siteSettingsSchema = new mongoose_1.Schema({
    siteName: { type: String },
    siteLogo: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    contactAddress: { type: String },
    about: { type: String },
    socialLinks: {
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        youtube: { type: String },
        tiktok: { type: String },
    },
    discountBanner: { type: String },
    appInfoBanner: { type: String },
}, {
    timestamps: true,
});
exports.SiteSettingsModel = (0, mongoose_1.model)('SiteSettings', siteSettingsSchema);
