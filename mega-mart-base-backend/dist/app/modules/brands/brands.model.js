"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandModel = void 0;
const mongoose_1 = require("mongoose");
const iconSchema = new mongoose_1.Schema({
    name: { type: String },
    url: { type: String },
}, { _id: false });
const imageSchema = new mongoose_1.Schema({
    layout: { type: String, enum: ["grid", "slider"], required: true },
    image: { type: String, required: true },
}, { _id: false });
const brandsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Brand can't create without a name!"],
    },
    icon: iconSchema,
    images: { type: [imageSchema], default: [] },
}, {
    timestamps: true,
});
exports.BrandModel = (0, mongoose_1.model)("brand", brandsSchema);
