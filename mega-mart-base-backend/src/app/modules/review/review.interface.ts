import { Types } from "mongoose";
export type TReview = {
  productInfo: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
};

