import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewModel } from "./review.modul";

export const createReviewDto = catchAsync(async (req, res) => {
  const { productInfo, rating, comment, userId } = req.body;

  // Check if user already reviewed this product
  const isAlreadyReviewed = await ReviewModel.findOne({
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
  const review = await ReviewModel.create({
    productInfo,
    userId,
    rating,
    comment,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: review,
  });
});
