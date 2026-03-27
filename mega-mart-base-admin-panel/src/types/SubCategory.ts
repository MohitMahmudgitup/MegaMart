// src/types/TSubCategory.interface.ts
export interface TIcon {
  name?: string;
  url?: string;
}

export interface TSubCategory {
  _id?: string; // MongoDB automatically generates _id
  name: string;
  slug?: string;
  details: string;
  icon?: TIcon;
  image: string;
  bannerImg: string;
  isFeatured?: boolean;
  createdAt?: string; // timestamps from mongoose
  updatedAt?: string;
}