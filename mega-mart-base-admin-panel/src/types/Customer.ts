// Auth info interface
interface IAuth {
  provider: string;
  providerId: string;
}

// User interface nested inside Customer
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  contactNo: string;
  bio: string;
  status: string;
  walletPoint: number;
  socials: any[];
  cardInfo: any | null;
  auths: IAuth[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Main Customer interface
export interface ICustomer {
  _id: string;
  userId: IUser;
  cardInfo: any | null;
  wishlist: any[];
  address: any[];
  cartItem: any[];
  orders: any[];
  createdAt: string;
  updatedAt: string;
}