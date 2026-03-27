
export interface IVariant {
  color: string;
  size: string;
  price: number;
  stock: number;
}


export type TBrandAndCategories = {
  brand: {
    _id: string;
    name: string;
    icon: { name: string; url: string };
    images: { layout: string; image: string }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  categories: {
    _id: string;
    name: string;
    slug: string;
    details: string;
    icon: { name: string; url: string };
    image: string;
    bannerImg: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
  tags: {
    _id: string;
    name: string;
    slug: string;
    details: string;
    icon: { name: string; url: string };
    image: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
};

export type TDescription = {
  name: string;
  slug?: string;
  unit: string;
  description: string;
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

export type IProduct = {
  _id: string;
  vendorId?: string;
  shopId: string;
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
};



export interface IProductsState  {
  products: IProduct[];
  singleProduct: IProduct | null;
};              
