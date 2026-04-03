import { model, Schema } from 'mongoose';
import {
  IVariant,
  TBrandAndCategories,
  TDescription,
  TExternal,
  TProduct,
  TProductInfo,
} from './product.interface';

// Variant schema
const VariantSchema = new Schema<IVariant>(
  {
    color: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { _id: false }
);

// Brand and Categories schema (updated with subCategories)
const brandAndCategorySchema = new Schema<TBrandAndCategories>(
  {
    brand: {
      type: Schema.Types.ObjectId,
      required: [true, 'Brand is Required!'],
      ref: 'brand',
    },
    categories: {
      type: [Schema.Types.ObjectId],
      required: [true, 'Category is Required!'],
      ref: 'category',
    },
    subCategories: {
      type: [Schema.Types.ObjectId],
      ref: 'subCategories',
      default: [],
    },
    tags: {
      type: [Schema.Types.ObjectId],
      required: [true, 'Tag is Required!'],
      ref: 'tag',
    },
  },
  { _id: false }
);

// Description schema
const descriptionSchema = new Schema<TDescription>(
  {
    name: { type: String, required: [true, 'Name is Required!'] },
    slug: { type: String },
    unit: { type: String, required: [true, 'Unit is Required!'] },
    description: { type: String, required: [true, 'A description is required!'] },
    shortdescription: { type: String, required: [true, 'A short description is required!'] },
    status: { type: String, enum: ['publish', 'draft'], default: 'draft', required: true },
  },
  { _id: false }
);

// External schema
const externalSchema = new Schema<TExternal>(
  {
    productUrl: { type: String },
    buttonLabel: { type: String },
  },
  { _id: false }
);

// Product info schema
const productInfoSchema = new Schema<TProductInfo>(
  {
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
  },
  { timestamps: true }
);

// Main Product schema
const productSchema = new Schema<TProduct>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'vendor' },
    shopId: { type: Schema.Types.ObjectId, ref: 'shop', required: [true, 'ShopId is Required!'] },
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
  },
  { timestamps: true }
);

export const ProductModel = model<TProduct>('product', productSchema);