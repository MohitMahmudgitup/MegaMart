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
exports.withdrawalServices = void 0;
const withdrawals_model_1 = __importDefault(require("./withdrawals.model"));
const createWithdrawalOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.vendorId) {
        throw new Error('Vendor ID is required');
    }
    const result = yield withdrawals_model_1.default.create(payload);
    return result;
});
const getWithdrawalsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.default.find({ isDeleted: { $ne: true } })
        .populate('vendorId')
        .sort({ createdAt: -1 });
    return result;
});
const getSingleWithdrawalFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.default.findById(id).populate('vendorId');
    return result;
});
const getVendorsWithdrawalFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.default.find({
        vendorId: id,
        isDeleted: { $ne: true },
    }).sort({
        createdAt: -1,
    });
    return result;
});
const updateWithdrawalOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawals_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteWithdrawalFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error('ID is required');
    const result = yield withdrawals_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
exports.withdrawalServices = {
    createWithdrawalOnDB,
    getWithdrawalsFromDB,
    getSingleWithdrawalFromDB,
    updateWithdrawalOnDB,
    deleteWithdrawalFromDB,
    getVendorsWithdrawalFromDB,
};
