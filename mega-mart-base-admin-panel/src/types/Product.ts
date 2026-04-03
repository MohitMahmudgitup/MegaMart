
export type TBrandAndCategoriesPopulated = {
   brand: {
      _id: string;
      name: string;
      title: string;
      description: string;
      images: {
        layout: string;
        image: string;
      }[];
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
   categories: {
      _id: string;
      name: string;
      slug: string;
      details: string;
      image: string;
      bannerImg: string;
      isFeatured: boolean;

      subCategories: {
        _id: string;
        name: string;
        slug: string;
        details: string;
        image: string;
        bannerImg: string;
        isFeatured: boolean;
        createdAt: string;
        updatedAt: string;
        __v: number;
      }[];

      createdAt: string;
      updatedAt: string;
      __v: number;
      icon: any;
    }[];
  subCategories: {
        _id: string;
        name: string;
        slug: string;
        details: string;
        image: string;
        bannerImg: string;
        isFeatured: boolean;
        createdAt: string;
        updatedAt: string;
        __v: number;
      }[];
    tags: {
      _id: string;
      name: string;
      slug: string;
      type: string;
      details: string;
      icon: {
        name: string;
        url: string;
      };
      image: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }[];
};

export interface IProduct {
  _id: string;
  vendorId: string;
  shopId: string;

  featuredImg: string;
  gallery: string[];
  video: string;

  brandAndCategories: TBrandAndCategoriesPopulated;

  description: {
    name: string;
    slug: string;
    unit: string;
    description: string;
    shortdescription: string;
    status: "publish" | "draft";
  };

  productType: "simple" | "variable";

  productInfo: {
    _id: string;
    price: number;
    salePrice: number;
    quantity: number;
    sku: string;
    width: string;
    height: string;
    length: string;
    isExternal: boolean;
    external: {
      productUrl: string;
      buttonLabel: string;
    };
    createdAt: string;
    updatedAt: string;
  };

  specifications: {
    _id: string;
    key: string;
    value: string;
  }[];

  variants: {
    color: string;
    size: string;
    price: number;
    stock: number;
  }[];

  createdAt: string;
  updatedAt: string;
  __v: number;
}