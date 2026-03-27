export interface ICategory {
  subCategories: [];
  _id: string;
  isFeatured?: boolean;
  vendorId: string;
  name: string;
  slug: string;
  details: string;
  icon: {
    name: string;
    url: string;
  };
  description: string
  image: File;
  bannerImg: File;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
