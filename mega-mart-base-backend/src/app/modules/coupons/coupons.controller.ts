import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { couponServices } from './coupons.service';

const getAllCoupons = catchAsync(async (req, res) => {
  const {data, meta} = await couponServices.getAllCouponsFromDB(req.query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Coupons retrieved successfully!',
    data: data,
    meta: meta
  });
});

const getSingleCoupon = catchAsync(async (req, res) => {
  const result = await couponServices.getSingleCouponFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Coupon retrieved successfully!',
    data: result,
  });
});

const getCouponByCode = catchAsync(async (req, res) => {
  const { shopId } = req.query;
  const result = await couponServices.getCouponByCodeFromDB(
    req.params.code,
    shopId as string
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Coupon retrieved successfully!',
    data: result,
  });
});

const createCoupon = catchAsync(async (req, res) => {
  const result = await couponServices.createCouponIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Coupon created successfully!',
    data: result,
  });
});

const updateCoupon = catchAsync(async (req, res) => {
  const result = await couponServices.updateCouponIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Coupon updated successfully!',
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req, res) => {
  const result = await couponServices.deleteCouponFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Coupon deleted successfully!',
    data: result,
  });
});

const validateCoupon = catchAsync(async (req, res) => {
  const { code, userId, orderAmount, productIds } = req.body;
  
  const result = await couponServices.validateCouponForOrder(
    code,
    userId,
    orderAmount,
    productIds
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Coupon validated successfully!',
    data: result,
  });
});

const applyCoupon = catchAsync(async (req, res) => {
  const result = await couponServices.applyCouponToOrder(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Coupon applied successfully!',
    data: result,
  });
});

export const couponControllers = {
  getAllCoupons,
  getSingleCoupon,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
};
