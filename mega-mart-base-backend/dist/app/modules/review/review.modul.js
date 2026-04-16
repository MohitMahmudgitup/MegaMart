"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    productInfo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.ReviewModel = (0, mongoose_1.model)("Review", reviewSchema);
