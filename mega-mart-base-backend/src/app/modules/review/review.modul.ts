import { model, Schema } from "mongoose";
import { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>({
    productInfo: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

export const ReviewModel = model<TReview>("Review", reviewSchema);
