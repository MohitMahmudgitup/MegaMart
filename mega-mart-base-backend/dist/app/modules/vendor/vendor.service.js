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
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorServices = void 0;
const vendor_model_1 = require("./vendor.model");
const createVendorOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_model_1.VendorModel.create(payload);
    return result;
});
const getAllVendorFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorQuery = yield vendor_model_1.VendorModel.find().populate("userId");
    const result = yield vendorQuery;
    return result;
});
const getSingleVendorFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_model_1.VendorModel.find({ userId: id });
    return result;
});
const getVendorByUserIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_model_1.VendorModel.findOne({ userId: id });
    return result;
});
const updateStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    return vendor_model_1.VendorModel.findByIdAndUpdate(id, { status }, { new: true });
});
exports.vendorServices = {
    createVendorOnDB,
    getAllVendorFromDB,
    getSingleVendorFromDB,
    getVendorByUserIdFromDB,
    updateStatus,
};
