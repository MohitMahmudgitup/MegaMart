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
exports.categoryServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const product_model_1 = require("../product/product.model");
const category_model_1 = require("./category.model");
const http_status_1 = __importDefault(require("http-status"));
const getAllCategoryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.CategoryModel.find();
    return result;
});
const getSingleCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.CategoryModel.findById(id).populate('subCategories');
    return result;
});
const createCategoryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield category_model_1.CategoryModel.findOne({ name: payload === null || payload === void 0 ? void 0 : payload.name });
    //creating slug
    payload.slug = payload.name.split(" ").join("-").toLowerCase();
    if (payload.isFeatured === true) {
        const featuredCount = yield category_model_1.CategoryModel.countDocuments({
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
    const result = yield category_model_1.CategoryModel.create(payload);
    return result;
});
const editCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield category_model_1.CategoryModel.findById(id);
    if (!isCategoryExists) {
        throw new handleAppError_1.default(404, 'Category not Found!');
    }
    if (payload.isFeatured === true) {
        const featuredCount = yield category_model_1.CategoryModel.countDocuments({
            isFeatured: true,
        });
        if (featuredCount >= 4) {
            payload.isFeatured = false;
            throw new handleAppError_1.default(400, 'Maximum 4 featured categories allowed! This category has been set to non-featured.');
        }
    }
    const updatedCategory = yield category_model_1.CategoryModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (payload.deletedImages && payload.deletedImages.length > 0) {
        yield Promise.all(payload.deletedImages.map(imageurl => (0, cloudinary_config_1.deleteImageFromCLoudinary)(imageurl)));
    }
    return updatedCategory;
});
const deleteCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.CategoryModel.findByIdAndDelete(id);
    return result;
});
const getAllProductinCategoryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.ProductModel.find()
        .populate("brandAndCategories.categories", "_id name  details bannerImg ")
        .populate("brandAndCategories.subCategories", "_id name   details bannerImg")
        .lean();
    const categoryMap = new Map();
    products.forEach((product) => {
        const { categories = [], subCategories = [] } = product.brandAndCategories || {};
        categories.forEach((cat) => {
            const catId = cat._id.toString();
            // 🔥 If category not exists → create
            if (!categoryMap.has(catId)) {
                categoryMap.set(catId, {
                    _id: cat._id,
                    name: cat.name,
                    bannerImg: cat.bannerImg,
                    details: cat.details,
                    subCategories: [],
                });
            }
            // 🔥 Add subcategories (no duplicate)
            const existingCategory = categoryMap.get(catId);
            subCategories.forEach((sub) => {
                const alreadyExists = existingCategory.subCategories.some((s) => s._id.toString() === sub._id.toString());
                if (!alreadyExists) {
                    existingCategory.subCategories.push({
                        _id: sub._id,
                        name: sub.name,
                        details: sub.details,
                        bannerImg: sub.bannerImg,
                    });
                }
            });
        });
    });
    return Array.from(categoryMap.values());
});
exports.categoryServices = {
    getAllCategoryFromDB,
    getSingleCategoryFromDB,
    createCategoryIntoDB,
    deleteCategoryFromDB,
    editCategory,
    getAllProductinCategoryFromDB
};
