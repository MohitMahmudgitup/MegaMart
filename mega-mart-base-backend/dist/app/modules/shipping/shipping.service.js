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
exports.shippingServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const shipping_model_1 = require("./shipping.model");
const createShippingOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shipping_model_1.ShippingModel.create(payload);
    return result;
});
const updateShippingOnDB = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield shipping_model_1.ShippingModel.findById(id);
    if (!isExist) {
        throw new Error('Shipping data not found!');
    }
    const result = yield shipping_model_1.ShippingModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteShippingOnDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield shipping_model_1.ShippingModel.findById(id);
    if (!isExist) {
        throw new Error('Shipping data not found!');
    }
    const result = yield shipping_model_1.ShippingModel.findByIdAndDelete(id);
    return result;
});
const getAllShippingFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const shippingQuery = new QueryBuilder_1.default(shipping_model_1.ShippingModel.find(), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield shippingQuery.modelQuery;
    return result;
});
const getSingleShippingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shipping_model_1.ShippingModel.findById(id);
    return result;
});
const shippingStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield shipping_model_1.ShippingModel.aggregate([
        {
            $group: {
                _id: "$name",
                totalUsage: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
                types: { $addToSet: "$type" },
                globalCount: {
                    $sum: { $cond: [{ $eq: ["$global", "1"] }, 1, 0] },
                },
            },
        },
        {
            $group: {
                _id: null,
                carriers: { $sum: 1 }, // কতগুলো আলাদা carrier আছে
                shippingMethods: { $sum: "$totalUsage" }, // মোট method count
                revenue: { $sum: "$totalAmount" }, // সব amount এর যোগফল
                details: { $push: "$$ROOT" },
            },
        },
        {
            $project: {
                _id: 0,
                shippingMethods: 1,
                carriers: 1,
                avgDeliveryTime: { $literal: 2.4 }, // আপাতত static
                revenue: 1,
                details: 1,
            },
        },
    ]);
    return stats[0] || {};
});
exports.shippingServices = {
    createShippingOnDB,
    getAllShippingFromDB,
    getSingleShippingFromDB,
    updateShippingOnDB,
    deleteShippingOnDB,
    shippingStats,
};
