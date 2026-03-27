import httpStatus from 'http-status';
import AppError from '../../errors/handleAppError';
import { CouponSearchableFields } from './coupons.const';
import { TCoupon } from './coupons.interface';
import { CouponModel } from './coupons.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const getAllCouponsFromDB = async (query: Record<string, string>) => {
  

  const couponsQuery = new QueryBuilder(CouponModel.find(), query)

  const allCoupons = couponsQuery.search(CouponSearchableFields).filter().sort().paginate();

  const [data, meta] = await Promise.all([
    allCoupons.build().exec(),
    couponsQuery.getMeta()
  ])
  
  return {
    data, meta
  }
};

const getSingleCouponFromDB = async (id: string) => {
  const result = await CouponModel.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found!');
  }

  return result;
};

const getCouponByCodeFromDB = async (code: string, shopId?: string) => {
  const query: any = {
    code: code.toUpperCase(),
    isActive: true,
    expireDate: { $gte: new Date() },
  };

  // If shopId is provided, find coupons for that shop or global coupons
  if (shopId) {
    query.$or = [
      { scope: 'global' },
      { scope: 'shop', shopId: shopId },
    ];
  } else {
    // If no shopId, only return global coupons
    query.scope = 'global';
  }

  const result = await CouponModel.findOne(query);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found or expired!');
  }

  // Check if usage limit reached
  if (result.usageLimit && result.usedCount && result.usedCount >= result.usageLimit) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Coupon usage limit reached!');
  }

  return result;
};

const createCouponIntoDB = async (payload: TCoupon) => {
  // Check if coupon code already exists
  const existingCoupon = await CouponModel.findOne({ code: payload.code.toUpperCase() });
  
  if (existingCoupon) {
    throw new AppError(httpStatus.CONFLICT, 'Coupon code already exists!');
  }

  // Validate dates
  if (payload.activeDate && payload.expireDate && new Date(payload.activeDate) >= new Date(payload.expireDate)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Active date must be before expire date!');
  }

  // Validate percentage discount
  if (payload.type === 'percentage' && payload.discountAmount > 100) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Percentage discount cannot exceed 100%!');
  }

  // Validate scope and shopId relationship
  if (payload.scope === 'shop' && !payload.shopId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'shopId is required when scope is shop!');
  }

  // Validate ownerType and ownerId relationship
  if (payload.ownerType === 'vendor' && !payload.ownerId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'ownerId is required when ownerType is vendor!');
  }

  // Admin can only create global coupons
  if (payload.ownerType === 'admin' && payload.scope === 'shop') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Admin can only create global coupons!');
  }

  // Vendor can only create shop-specific coupons
  if (payload.ownerType === 'vendor' && payload.scope === 'global') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Vendor can only create shop-specific coupons!');
  }

  const result = await CouponModel.create(payload);
  return result;
};

const updateCouponIntoDB = async (id: string, payload: Partial<TCoupon>) => {
  const coupon = await CouponModel.findById(id);

  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found!');
  }

  // Check if updating code and it already exists
  if (payload.code && payload.code !== coupon.code) {
    const existingCoupon = await CouponModel.findOne({ code: payload.code.toUpperCase() });
    if (existingCoupon) {
      throw new AppError(httpStatus.CONFLICT, 'Coupon code already exists!');
    }
  }

  // Validate dates if updating
  const activeDate = payload.activeDate || coupon.activeDate;
  const expireDate = payload.expireDate || coupon.expireDate;
  
  if (activeDate && expireDate && new Date(activeDate) >= new Date(expireDate)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Active date must be before expire date!');
  }

  // Validate percentage discount
  const type = payload.type || coupon.type;
  const discountAmount = payload.discountAmount || coupon.discountAmount;
  
  if (type === 'percentage' && discountAmount > 100) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Percentage discount cannot exceed 100%!');
  }

  const result = await CouponModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteCouponFromDB = async (id: string) => {
  const coupon = await CouponModel.findById(id);

  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found!');
  }

  const result = await CouponModel.findByIdAndDelete(id);
  return result;
};

const validateCouponForOrder = async (
  code: string,
  userId: string,
  orderAmount: number,
  productIds?: string[]
) => {
  const coupon = await getCouponByCodeFromDB(code);

  // Check if coupon is active
  if (!coupon.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Coupon is not active!');
  }

  // Check active date
  if (coupon.activeDate && new Date() < new Date(coupon.activeDate)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Coupon is not yet active!');
  }

  // Check minimum order amount
  if (orderAmount < coupon.minimumOrderAmount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Minimum order amount of ${coupon.minimumOrderAmount} required!`
    );
  }

  // Check user restriction
  if (coupon.userRestriction && coupon.userRestriction.length > 0) {
    if (!coupon.userRestriction.includes(userId)) {
      throw new AppError(httpStatus.FORBIDDEN, 'This coupon is not available for you!');
    }
  }

  // Check product restriction
  if (coupon.productRestriction && coupon.productRestriction.length > 0 && productIds) {
    const hasValidProduct = productIds.some(id => 
      coupon.productRestriction?.includes(id)
    );
    if (!hasValidProduct) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Coupon not applicable for these products!');
    }
  }

  // Calculate discount
  let discountValue = 0;
  if (coupon.type === 'fixed') {
    discountValue = coupon.discountAmount;
  } else if (coupon.type === 'percentage') {
    discountValue = (orderAmount * coupon.discountAmount) / 100;
    if (coupon.maximumDiscount && discountValue > coupon.maximumDiscount) {
      discountValue = coupon.maximumDiscount;
    }
  }

  return {
    coupon,
    discountValue,
    finalAmount: orderAmount - discountValue,
  };
};

const applyCouponToOrder = async (couponId: string) => {
  const coupon = await CouponModel.findById(couponId);

  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found!');
  }

  // Increment used count
  const result = await CouponModel.findByIdAndUpdate(
    couponId,
    { $inc: { usedCount: 1 } },
    { new: true }
  );

  return result;
};

export const couponServices = {
  getAllCouponsFromDB,
  getSingleCouponFromDB,
  getCouponByCodeFromDB,
  createCouponIntoDB,
  updateCouponIntoDB,
  deleteCouponFromDB,
  validateCouponForOrder,
  applyCouponToOrder,
};
