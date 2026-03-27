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
exports.couponServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const coupons_const_1 = require("./coupons.const");
const coupons_model_1 = require("./coupons.model");
const getAllCouponsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const couponQuery = new QueryBuilder_1.default(coupons_model_1.CouponModel.find(), query)
        .search(coupons_const_1.CouponSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield couponQuery.modelQuery;
    return result;
});
const getSingleCouponFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupons_model_1.CouponModel.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found!');
    }
    return result;
});
const getCouponByCodeFromDB = (code, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
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
    }
    else {
        // If no shopId, only return global coupons
        query.scope = 'global';
    }
    const result = yield coupons_model_1.CouponModel.findOne(query);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found or expired!');
    }
    // Check if usage limit reached
    if (result.usageLimit && result.usedCount && result.usedCount >= result.usageLimit) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon usage limit reached!');
    }
    return result;
});
const createCouponIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if coupon code already exists
    const existingCoupon = yield coupons_model_1.CouponModel.findOne({ code: payload.code.toUpperCase() });
    if (existingCoupon) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, 'Coupon code already exists!');
    }
    // Validate dates
    if (payload.activeDate && payload.expireDate && new Date(payload.activeDate) >= new Date(payload.expireDate)) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'Active date must be before expire date!');
    }
    // Validate percentage discount
    if (payload.type === 'percentage' && payload.discountAmount > 100) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'Percentage discount cannot exceed 100%!');
    }
    // Validate scope and shopId relationship
    if (payload.scope === 'shop' && !payload.shopId) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'shopId is required when scope is shop!');
    }
    // Validate ownerType and ownerId relationship
    if (payload.ownerType === 'vendor' && !payload.ownerId) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'ownerId is required when ownerType is vendor!');
    }
    // Admin can only create global coupons
    if (payload.ownerType === 'admin' && payload.scope === 'shop') {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'Admin can only create global coupons!');
    }
    // Vendor can only create shop-specific coupons
    if (payload.ownerType === 'vendor' && payload.scope === 'global') {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'Vendor can only create shop-specific coupons!');
    }
    const result = yield coupons_model_1.CouponModel.create(payload);
    return result;
});
const updateCouponIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupons_model_1.CouponModel.findById(id);
    if (!coupon) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found!');
    }
    // Check if updating code and it already exists
    if (payload.code && payload.code !== coupon.code) {
        const existingCoupon = yield coupons_model_1.CouponModel.findOne({ code: payload.code.toUpperCase() });
        if (existingCoupon) {
            throw new handleAppError_1.default(http_status_1.default.CONFLICT, 'Coupon code already exists!');
        }
    }
    // Validate dates if updating
    const activeDate = payload.activeDate || coupon.activeDate;
    const expireDate = payload.expireDate || coupon.expireDate;
    if (activeDate && expireDate && new Date(activeDate) >= new Date(expireDate)) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'Active date must be before expire date!');
    }
    // Validate percentage discount
    const type = payload.type || coupon.type;
    const discountAmount = payload.discountAmount || coupon.discountAmount;
    if (type === 'percentage' && discountAmount > 100) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'Percentage discount cannot exceed 100%!');
    }
    const result = yield coupons_model_1.CouponModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteCouponFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupons_model_1.CouponModel.findById(id);
    if (!coupon) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found!');
    }
    const result = yield coupons_model_1.CouponModel.findByIdAndDelete(id);
    return result;
});
const validateCouponForOrder = (code, userId, orderAmount, productIds) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield getCouponByCodeFromDB(code);
    // Check if coupon is active
    if (!coupon.isActive) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon is not active!');
    }
    // Check active date
    if (coupon.activeDate && new Date() < new Date(coupon.activeDate)) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon is not yet active!');
    }
    // Check minimum order amount
    if (orderAmount < coupon.minimumOrderAmount) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Minimum order amount of ${coupon.minimumOrderAmount} required!`);
    }
    // Check user restriction
    if (coupon.userRestriction && coupon.userRestriction.length > 0) {
        if (!coupon.userRestriction.includes(userId)) {
            throw new handleAppError_1.default(http_status_1.default.FORBIDDEN, 'This coupon is not available for you!');
        }
    }
    // Check product restriction
    if (coupon.productRestriction && coupon.productRestriction.length > 0 && productIds) {
        const hasValidProduct = productIds.some(id => { var _a; return (_a = coupon.productRestriction) === null || _a === void 0 ? void 0 : _a.includes(id); });
        if (!hasValidProduct) {
            throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon not applicable for these products!');
        }
    }
    // Calculate discount
    let discountValue = 0;
    if (coupon.type === 'fixed') {
        discountValue = coupon.discountAmount;
    }
    else if (coupon.type === 'percentage') {
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
});
const applyCouponToOrder = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupons_model_1.CouponModel.findById(couponId);
    if (!coupon) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found!');
    }
    // Increment used count
    const result = yield coupons_model_1.CouponModel.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } }, { new: true });
    return result;
});
exports.couponServices = {
    getAllCouponsFromDB,
    getSingleCouponFromDB,
    getCouponByCodeFromDB,
    createCouponIntoDB,
    updateCouponIntoDB,
    deleteCouponFromDB,
    validateCouponForOrder,
    applyCouponToOrder,
};
