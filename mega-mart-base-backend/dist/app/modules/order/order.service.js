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
exports.orderServices = void 0;
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const order_model_1 = require("./order.model");
const order_consts_1 = require("./order.consts");
const nanoid_1 = require("nanoid");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const mongoose_1 = require("mongoose");
const getAllOrdersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const attributeQuery = new QueryBuilder_1.QueryBuilder(order_model_1.OrderModel.find(), query);
    const allAttributes = attributeQuery
        .search(['_id'])
        .filter()
        .sort()
        .paginate();
    allAttributes.modelQuery = allAttributes.modelQuery.populate([
        {
            path: 'orderInfo.productInfo',
            select: '_id featuredImg description.name', // only needed fields
        },
        {
            path: 'orderInfo.shopInfo',
            select: 'shopAddress basicInfo',
        },
        {
            path: 'orderInfo.orderBy',
            select: 'userId',
        },
    ]);
    const [data, meta] = yield Promise.all([
        allAttributes.build().exec(),
        attributeQuery.getMeta(),
    ]);
    // 🔥 CLEAN DATA HERE
    const cleanedData = data.map((order) => {
        const orderObj = order.toObject();
        orderObj.orderInfo = orderObj.orderInfo.map((item) => {
            var _a;
            if (item.productInfo) {
                item.productInfo = {
                    _id: item.productInfo._id,
                    name: (_a = item.productInfo.description) === null || _a === void 0 ? void 0 : _a.name,
                    featuredImg: item.productInfo.featuredImg,
                };
            }
            return item;
        });
        return orderObj;
    });
    return {
        data: cleanedData,
        meta,
    };
});
const getMyOrdersFromDB = (customerId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const ordersQuery = new QueryBuilder_1.QueryBuilder(order_model_1.OrderModel.find({ 'orderInfo.orderBy': customerId })
        .populate('paymentId', 'orderId customerId transactionId status amount createdAt updatedAt')
        .populate('orderInfo.productInfo', 'description featuredImg'), query);
    const allCoupons = ordersQuery.search(order_consts_1.OrderSearchableFields).filter().sort().paginate();
    const [data, meta] = yield Promise.all([
        allCoupons.build().exec(),
        ordersQuery.getMeta()
    ]);
    return {
        data, meta
    };
});
const getSingleOrderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = order_model_1.OrderModel.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, 'Order does not exists!');
    }
    return result;
});
const createOrderIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload) {
        payload.orderInfo.forEach(order => (order.trackingNumber = (0, nanoid_1.nanoid)()));
    }
    const result = yield order_model_1.OrderModel.create(payload);
    return result;
});
const cancelOrderIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield order_model_1.OrderModel.findById(id);
    if (!isExist) {
        throw new handleAppError_1.default(404, 'Order not found');
    }
    const result = yield order_model_1.OrderModel.findByIdAndUpdate(id, { 'orderInfo.$[].isCancelled': true, 'orderInfo.$[].status': 'cancelled' }, { new: true, runValidators: true });
    return result;
});
const updateStatsIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield order_model_1.OrderModel.findById(id);
    if (!isExist) {
        throw new handleAppError_1.default(404, 'Order not found');
    }
    const result = yield order_model_1.OrderModel.findByIdAndUpdate(id, { 'orderInfo.$[].status': payload.status }, { new: true, runValidators: true });
    return result;
});
const updatetrackingLinkIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield order_model_1.OrderModel.findById(id);
    if (!isExist) {
        throw new handleAppError_1.default(404, 'Order not found');
    }
    const result = yield order_model_1.OrderModel.findByIdAndUpdate(id, { trackingCode: payload.trackCode }, { new: true, runValidators: true });
    return result;
});
const deleteOrderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield order_model_1.OrderModel.findById(id);
    if (!isExist) {
        throw new handleAppError_1.default(404, 'Order not found');
    }
    const result = yield order_model_1.OrderModel.findByIdAndDelete(id);
    return result;
});
const getGuestOrdersFromDB = (orderIds) => __awaiter(void 0, void 0, void 0, function* () {
    const objectIds = orderIds
        .filter(id => mongoose_1.Types.ObjectId.isValid(id))
        .map(id => new mongoose_1.Types.ObjectId(id));
    if (objectIds.length === 0)
        return [];
    const orders = yield order_model_1.OrderModel.find({
        _id: { $in: objectIds },
    })
        .populate({
        path: "orderInfo.productInfo",
        select: "description featuredImg",
    })
        .populate("paymentId", "orderId customerId transactionId status amount createdAt updatedAt")
        .sort({ createdAt: -1 })
        .lean();
    return orders;
});
exports.orderServices = {
    getAllOrdersFromDB,
    getSingleOrderFromDB,
    createOrderIntoDB,
    getMyOrdersFromDB,
    cancelOrderIntoDB,
    updateStatsIntoDB,
    updatetrackingLinkIntoDB,
    deleteOrderFromDB,
    getGuestOrdersFromDB
};
