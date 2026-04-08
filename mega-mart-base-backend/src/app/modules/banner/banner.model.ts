import { Schema, model } from 'mongoose';

const bannerSchema = new Schema(
  {
    title: { type: String },
    subTitle: { type: String},
    image: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    discount: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BannerModel = model('Banner', bannerSchema);
