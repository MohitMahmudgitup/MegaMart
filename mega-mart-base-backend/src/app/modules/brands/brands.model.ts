import { model, Schema } from "mongoose";
import { TBrands } from "./brands.interface";

const iconSchema = new Schema(
  {
    name: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const imageSchema = new Schema(
  {
    layout: { type: String, enum: ["grid", "slider"], required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const brandsSchema = new Schema<TBrands>(
  {
    name: {
      type: String,
      required: [true, "Brand can't create without a name!"],
    },
    title: {
      type: String,
      required: [true, "Brand can't create without a title!"],
    },
    description: {
      type: String,
      required: [true, "Brand can't create without a description!"],
    },
    icon: iconSchema,
    images: { type: [imageSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const BrandModel = model<TBrands>("brand", brandsSchema);
