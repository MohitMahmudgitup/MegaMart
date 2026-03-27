import { model, Schema } from "mongoose";
import { TSubCategory } from "./TSubCategory.interface";

const iconSchema = new Schema(
  {
    name: { type: String},
    url: { type: String },
  },
  { _id: false } 
);

const subCategories = new Schema<TSubCategory>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const subCategoryModel = model<TSubCategory>("subCategories", subCategories);
