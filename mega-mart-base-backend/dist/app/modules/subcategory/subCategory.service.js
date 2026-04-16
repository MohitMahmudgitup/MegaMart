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
exports.subCategoryServices = void 0;
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const subcategory_model_1 = require("./subcategory.model");
const http_status_1 = __importDefault(require("http-status"));
const getAllSubCategoryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subcategory_model_1.subCategoryModel.find();
    return result;
});
const getSingleSubCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subcategory_model_1.subCategoryModel.findById(id);
    return result;
});
const createsubCategoryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield subcategory_model_1.subCategoryModel.findOne({ name: payload === null || payload === void 0 ? void 0 : payload.name });
    //creating slug
    payload.slug = payload.name.split(" ").join("-").toLowerCase();
    if (payload.isFeatured === true) {
        const featuredCount = yield subcategory_model_1.subCategoryModel.countDocuments({
            isFeatured: true,
        });
        if (featuredCount >= 4) {
            payload.isFeatured = false;
            throw new handleAppError_1.default(400, 'Maximum 4 featured categories allowed! This category has been set to non-featured.');
        }
    }
    if (isCategoryExists) {
        throw new handleAppError_1.default(http_status_1.default.CONFLICT, `Category with ${isCategoryExists === null || isCategoryExists === void 0 ? void 0 : isCategoryExists.name} is already exists!`);
    }
    const result = yield subcategory_model_1.subCategoryModel.create(payload);
    return result;
});
exports.subCategoryServices = {
    getAllSubCategoryFromDB,
    getSingleSubCategoryFromDB,
    createsubCategoryIntoDB
};
