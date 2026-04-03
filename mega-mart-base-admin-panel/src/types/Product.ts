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
  subCategories?: {
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