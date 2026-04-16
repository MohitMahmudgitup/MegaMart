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
exports.brandsControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const brands_service_1 = require("./brands.service");
const brands_model_1 = require("./brands.model");
const product_model_1 = require("../product/product.model");
const mongoose_1 = __importDefault(require("mongoose"));
const getAllBrands = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brands_service_1.brandServices.getAllBrandsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brands retrieve successfully!',
        data: result,
    });
}));
const getSingleBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield brands_service_1.brandServices.getSingleBrandFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand data retrieve successfully!',
        data: result,
    });
}));
const createBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const files = req.files;
    const iconDetails = {
        name: (_a = req.body.icon) === null || _a === void 0 ? void 0 : _a.name,
        url: (_c = (_b = files['iconImage']) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.path,
    };
    const brandData = Object.assign(Object.assign({}, req.body), { icon: ((_e = (_d = files['gridImage']) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.path) && {
            name: (_f = req.body.icon) === null || _f === void 0 ? void 0 : _f.name,
            url: (_h = (_g = files['iconImage']) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.path,
        }, images: [
            ((_k = (_j = files['gridImage']) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.path) && {
                layout: 'grid',
                image: (_m = (_l = files['gridImage']) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.path,
            },
            ((_p = (_o = files['sliderImage']) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.path) && {
                layout: 'slider',
                image: (_r = (_q = files['sliderImage']) === null || _q === void 0 ? void 0 : _q[0]) === null || _r === void 0 ? void 0 : _r.path,
            },
        ].filter(Boolean) });
    const result = yield brands_service_1.brandServices.createBrandOnDB(brandData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand created successfully!',
        data: result,
    });
}));
const updateBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const brand = yield brands_model_1.BrandModel.findById(req.params.id);
    if (!brand)
        throw new Error('Brand not found');
    const files = req.files;
    const updatedBrandData = Object.assign({}, req.body);
    // ====== ICON UPDATE ======
    const existingIcon = brand.icon || { name: '', url: '' };
    const iconFilePath = (_b = (_a = files === null || files === void 0 ? void 0 : files['iconImage']) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path;
    updatedBrandData.icon = {
        name: ((_c = req.body.icon) === null || _c === void 0 ? void 0 : _c.name) || existingIcon.name || '',
        url: iconFilePath || existingIcon.url || '',
    };
    // ====== IMAGE UPDATE ======
    const existingImages = brand.images || [];
    if ((_e = (_d = files['gridImage']) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.path) {
        const otherImages = existingImages.filter(img => img.layout !== 'grid');
        otherImages.push({
            layout: 'grid',
            image: files['gridImage'][0].path,
        });
        updatedBrandData.images = otherImages;
    }
    else {
        updatedBrandData.images = existingImages;
    }
    if ((_g = (_f = files['sliderImage']) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.path) {
        const otherImages = updatedBrandData.images.filter(img => img.layout !== 'slider');
        otherImages.push({
            layout: 'slider',
            image: files['sliderImage'][0].path,
        });
        updatedBrandData.images = otherImages;
    }
    const result = yield brands_service_1.brandServices.updateBrandOnDB(req.params.id, updatedBrandData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand updated successfully!',
        data: result,
    });
}));
const deleteBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield brands_service_1.brandServices.DeleteBrandOnDB(req.params.id);
    console.log('DELETE brand hit', req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brand deleted successfully!',
        data: null,
    });
}));
const getProductsByBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandId = req.params.id;
    const products = yield product_model_1.ProductModel.find({
        'brandAndCategories.brand': new mongoose_1.default.Types.ObjectId(brandId),
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Products retrieved successfully!',
        data: products,
    });
}));
// ------------------------------ data managemant-------------------------------
const getsliderImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brands_service_1.brandServices.getProductsByBrand();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Brands retrieve successfully!',
        data: result,
    });
}));
exports.brandsControllers = {
    getAllBrands,
    getSingleBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    getProductsByBrand,
    getsliderImage
};
