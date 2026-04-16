"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerModel = void 0;
const mongoose_1 = require("mongoose");
const bannerSchema = new mongoose_1.Schema({
    title: { type: String },
    subTitle: { type: String },
    image: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    discount: { type: Number },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.BannerModel = (0, mongoose_1.model)('Banner', bannerSchema);
