"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
// Variant schema
const VariantSchema = new mongoose_1.Schema({
    color: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
}, { _id: false });
// Brand and Categories schema (updated with subCategories)
const brandAndCategorySchema = new mongoose_1.Schema({
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Brand is Required!'],
        ref: 'brand',
    },
    categories: {
        type: [mongoose_1.Schema.Types.ObjectId],
        required: [true, 'Category is Required!'],
        ref: 'category',
    },
    subCategories: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'subCategories',
        default: [],
    },
    tags: {
        type: [mongoose_1.Schema.Types.ObjectId],
        required: [true, 'Tag is Required!'],
        ref: 'tag',
    },
}, { _id: false });
// Description schema
const descriptionSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, 'Name is Required!'] },
    slug: { type: String },
    unit: { type: String, required: [true, 'Unit is Required!'] },
    description: { type: String, required: [true, 'A description is required!'] },
    shortdescription: { type: String, required: [true, 'A short description is required!'] },
    status: { type: String, enum: ['publish', 'draft'], default: 'draft', required: true },
}, { _id: false });
// External schema
const externalSchema = new mongoose_1.Schema({
    productUrl: { type: String },
    buttonLabel: { type: String },
}, { _id: false });
// Product info schema
const productInfoSchema = new mongoose_1.Schema({
    price: { type: Number, required: [true, 'Price is Required!'] },
    salePrice: { type: Number, required: [true, 'Sale price is Required!'] },
    quantity: { type: Number, required: [true, 'Quantity is Required!'] },
    sku: { type: String, required: [true, 'SKU is Required!'] },
    width: { type: String },
    height: { type: String },
    length: { type: String },
    isDigital: { type: Boolean },
    digital: { type: String },
    isExternal: { type: Boolean },
    external: externalSchema,
}, { timestamps: true });
// Main Product schema
const productSchema = new mongoose_1.Schema({
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'vendor' },
    shopId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'shop', required: [true, 'ShopId is Required!'] },
    featuredImg: { type: String, required: [true, 'Featured image is Required!'] },
    gallery: { type: [String], required: [true, 'Gallery is Required!'], default: [] },
    video: { type: String },
    brandAndCategories: brandAndCategorySchema,
    description: descriptionSchema,
    productType: { type: String, enum: ['simple', 'variable'], required: [true, 'Product type is Required!'] },
    productInfo: productInfoSchema,
    specifications: [{ key: { type: String }, value: { type: String } }],
    variants: { type: [VariantSchema], required: true, default: [] },
    gender: { type: String, enum: ['male', 'female', 'unisex', 'kids'] },
}, { timestamps: true });
exports.ProductModel = (0, mongoose_1.model)('product', productSchema);
