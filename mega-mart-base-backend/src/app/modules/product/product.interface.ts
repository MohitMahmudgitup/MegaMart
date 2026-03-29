import { Types } from "mongoose";


export interface IVariant {
  color: string;
  size: string;
  price: number;
  stock: number;
}


export type TBrandAndCategories = {
  brand: Types.ObjectId;
  categories: Types.ObjectId[];
  tags: Types.ObjectId[];
};

export type TDescription = {
  name: string;
  slug?: string;
  unit: string;
  description: string;
  shortdescription: string;
  status: "publish" | "draft";
};

export type TExternal = {
  productUrl: string;
  buttonLabel: string;
};

export type TProductInfo = {
  price: number;
  salePrice: number;
  quantity: number;
  sku: string;
  width: string;
  height: string;
  length: string;
  isDigital?: boolean;
  digital?: string;
  isExternal?: boolean;
  external?: TExternal;
};

export type TProduct = {
  vendorId?: Types.ObjectId;
  shopId: Types.ObjectId;
  featuredImg: string;
  gallery: string[];
  video?: string;
  brandAndCategories: TBrandAndCategories;
  description: TDescription;
  productType: 'simple' | 'variable';
  productInfo: TProductInfo;
  specifications?: [{ key: string; value: string }];
  variants?: IVariant[];
  deletedImages?: string[];
  gender?: 'male' | 'female' | 'unisex';
};
