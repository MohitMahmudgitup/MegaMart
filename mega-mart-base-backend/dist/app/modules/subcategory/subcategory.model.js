"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subCategoryModel = void 0;
const mongoose_1 = require("mongoose");
const iconSchema = new mongoose_1.Schema({
    name: { type: String },
    url: { type: String },
}, { _id: false });
const subCategories = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "SubCategory can't create without a name!"],
    },
    slug: {
        type: String,
    },
    details: {
        type: String,
        required: [true, 'SubCategory need a description!'],
    },
    icon: iconSchema,
    image: {
        type: String,
        required: [true, 'An image is required to create SubCategory!'],
    },
    bannerImg: {
        type: String,
        required: [true, 'A banner image is required to create SubCategory!'],
    },
    isFeatured: { type: Boolean, default: false },
}, {
    timestamps: true,
});
exports.subCategoryModel = (0, mongoose_1.model)("subCategories", subCategories);
