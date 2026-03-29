import { model, Schema } from 'mongoose';
import {
  IVariant,
  TBrandAndCategories,
  TDescription,
  TExternal,
  TProduct,
  TProductInfo,
} from './product.interface';


const VariantSchema = new Schema<IVariant>(
  {
    color: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { _id: false }
);
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
    tags: {
      type: [Schema.Types.ObjectId],
      required: [true, 'Tag is Required!'],
      ref: 'tag',
    }, 
  },
  { _id: false }
);

const descriptionSchema = new Schema<TDescription>(
  {
    name: {
      type: String,
      required: [true, 'Name is Required!'],
    },
    slug: { type: String },
    unit: {
      type: String,
      required: [true, 'Unit is Required!'],
    },
    description: {
      type: String,
      required: [true, 'A small description is required!'],
    },
    shortdescription: {
      type: String,
      required: [true, 'A small description is required!'],
    },
    status: {
      type: String,
      enum: ['publish', 'draft'],
      required: [true, 'Status is required!'],
      default: 'draft',
    },
  },
  { _id: false }
);

const externalSchema = new Schema<TExternal>(
  {
    productUrl: {
      type: String,
    },
    buttonLabel: {
      type: String,
    },
  },
  { _id: false }
);

const productInfoSchema = new Schema<TProductInfo>(
  {
    price: {
      type: Number,
      required: [true, 'Price is Required!'],
    },
    salePrice: {
      type: Number,
      required: [true, 'Sale price is Required!'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is Required!'],
    },
    sku: {
      type: String,
      required: [true, 'sku is Required!'],
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    length: {
      type: String,
    },
    isDigital: {
      type: Boolean,
    },
    digital: {
      type: String,
    },
    isExternal: {
      type: Boolean,
    },
    external: externalSchema,
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema<TProduct>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'vendor',
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'shop',
      required: [true, 'ShopId is Required!'],
    },
    featuredImg: {
      type: String,
      required: [true, 'Feature image is Required!'],
    },
    gallery: {
      type: [String],
      required: [true, 'Gallery is Required!'],
      default: [],
    },
    video: {
      type: String,
    },
    brandAndCategories: brandAndCategorySchema,
    description: descriptionSchema,
    productType: {
      type: String,
      enum: ['simple', 'variable'],
      required: [true, 'Product type is Required!'],
    },
    productInfo: productInfoSchema,
    specifications: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    variants: {
      type: [VariantSchema],
      required: true,
      default: [],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unisex'],
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = model<TProduct>('product', productSchema);
