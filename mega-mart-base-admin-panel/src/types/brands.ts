export interface IBrand {
  _id?: string; 
  name: string;

  icon: {
    name?: string;
    url?: string;
    file?: File; 
  };

  images: {
    layout: string;
    image?: string;
    file?: File;
  };

  createdAt?: string;
  updatedAt?: string;
}
