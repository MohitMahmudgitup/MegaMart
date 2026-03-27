export type TBrandIcon = {
  name: string;
  url: string;
};

export type TImage = {
  layout: "grid" | "slider";
  image: string;
};

export type TBrands = {
  name: string;
  title: string;
  description: string;
  icon?: TBrandIcon;
  images: TImage[];
  deletedImages?: string[]
};
