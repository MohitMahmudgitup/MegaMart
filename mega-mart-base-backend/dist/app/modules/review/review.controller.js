"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewDto = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const review_modul_1 = require("./review.modul");
exports.createReviewDto = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productInfo, rating, comment, userId } = req.body;
    // Check if user already reviewed this product
    const isAlreadyReviewed = yield review_modul_1.ReviewModel.findOne({
        productInfo,
        userId,
    });
    //     if (isAlreadyReviewed) {
    //     return sendResponse(res, {
    //       success: false,
    //       statusCode: httpStatus.BAD_REQUEST,
    //       message: "You have already reviewed this product",
    //       data: isAlreadyReviewed,
    //     });
    //   }
    const review = yield review_modul_1.ReviewModel.create({
        productInfo,
        userId,
        rating,
        comment,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Review created successfully",
        data: review,
    });
}));
