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
const getAllOrdersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const attributeQuery = new QueryBuilder_1.QueryBuilder(order_model_1.OrderModel.find(), query);
    const SearchableFields = ['_id'];
    const allAttributes = attributeQuery
        .search(['_id'])
        .filter()
        .sort()
        .paginate();
    allAttributes.modelQuery = allAttributes.modelQuery.populate([
        {
            path: 'orderInfo.productInfo',
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
    const result = { data, meta };
    return result;
});
const getMyOrdersFromDB = (customerId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.QueryBuilder(order_model_1.OrderModel.find({ 'orderInfo.orderBy': customerId })
        .populate('paymentId', 'orderId customerId transactionId status amount createdAt updatedAt')
        .populate('orderInfo.productInfo', 'description featuredImg'), query)
        .search(order_consts_1.OrderSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    return result;
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
exports.orderServices = {
    getAllOrdersFromDB,
    getSingleOrderFromDB,
    createOrderIntoDB,
    getMyOrdersFromDB,
    cancelOrderIntoDB,
    updateStatsIntoDB,
    updatetrackingLinkIntoDB,
};
