import { Types } from "mongoose";

type TIcon = {
  name?: string;
  url?: string;
};

export type TCategory = {
  name: string;
  slug?: string;
  details: string;
  icon?: TIcon;
  image: string;
  bannerImg: string;
  isFeatured: boolean;
  brand: Types.ObjectId[];
  deletedImages?: string[];
};
