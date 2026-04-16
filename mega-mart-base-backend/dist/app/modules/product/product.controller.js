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
exports.getCategory = exports.getSingleEditProduct = exports.productcollections = exports.newArrivalsListData = exports.bestSellingProducts = exports.inventoryStats = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getSingleProduct = exports.getProductsByCategoryandsubcategory = exports.getAllProduct = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const product_service_1 = require("./product.service");
exports.getAllProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield product_service_1.productServices.getAllProductFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Products retrieve successfully!",
        data: data,
        meta: meta
    });
}));
// productController.ts
exports.getProductsByCategoryandsubcategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield product_service_1.productServices.getProductsByCategoryandSubcategory(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Products retrieved successfully!",
        data: result,
    });
}));
exports.getSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const productId = id.split("-").pop();
    const result = yield product_service_1.productServices.getSingleProductFromDB(productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product retrieve successfully!",
        data: result,
    });
}));
exports.createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const files = req.files;
    const productData = Object.assign(Object.assign({}, req.body), { featuredImg: ((_b = (_a = files["featuredImgFile"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) || req.body.featuredImg || '', gallery: files["galleryImagesFiles"]
            ? files["galleryImagesFiles"].map((f) => f.path)
            : req.body.gallery || [] });
    const result = yield product_service_1.productServices.createProductOnDB(productData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product created successfully!",
        data: result,
    });
}));
exports.updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id } = req.params;
    const files = req.files;
    const updatedData = Object.assign({}, req.body);
    if ((_b = (_a = files["featuredImgFile"]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) {
        updatedData.featuredImg = files["featuredImgFile"][0].path;
    }
    if ((_c = files["galleryImagesFiles"]) === null || _c === void 0 ? void 0 : _c.length) {
        updatedData.gallery = files["galleryImagesFiles"].map((f) => f.path);
    }
    const result = yield product_service_1.productServices.updateProductOnDB(id, updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product updated successfully!",
        data: result,
    });
}));
exports.deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield product_service_1.productServices.deleteProduct(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Product deleted successfully!',
        data: null,
    });
}));
exports.inventoryStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productServices.inventoryStats(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Inventory Get successfully!',
        data: result,
    });
}));
exports.bestSellingProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productServices.bestSellingProducts(req.query.category);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Inventory Get successfully!',
        data: result,
    });
}));
// --------------------------------------------data manager--------------------------------------------------
exports.newArrivalsListData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productServices.NewArrivalsListData();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'New Arrivals retrieved successfully!',
        data: result,
    });
}));
exports.productcollections = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productServices.productcollection();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Product collection retrieved successfully!',
        data: result,
    });
}));
exports.getSingleEditProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const productId = id.split("-").pop();
    const result = yield product_service_1.productServices.getSingleEditProductFromDB(productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product retrieve successfully!",
        data: result,
    });
}));
exports.getCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productServices.getCategory();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category retrieve successfully!",
        data: result,
    });
}));
