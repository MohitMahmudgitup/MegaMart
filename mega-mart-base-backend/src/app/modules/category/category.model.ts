import { model, Schema } from "mongoose";
import { TCategory } from "./category.interface";

const iconSchema = new Schema(
  {
    name: { type: String},
    url: { type: String },
  },
  { _id: false } 
);

const categorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: [true, "Category can't create without a name!"],
    },
    slug: {
      type: String,
    },
    details: {
      type: String,
      required: [true, 'Category need a description!'],
    },
    icon: iconSchema,
    image: {
      type: String,
      required: [true, 'An image is required to create category!'],
    },
    bannerImg: {
      type: String,
      required: [true, 'A banner image is required to create category!'],
    },
    isFeatured: { type: Boolean, default: false },
    subCategories: {
      type: [Schema.Types.ObjectId],
      ref: "subCategories",
      required: [true, 'Category is Required!'],
    },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = model<TCategory>("category", categorySchema);
