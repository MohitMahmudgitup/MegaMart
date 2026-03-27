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
exports.productServices = exports.bestSellingProducts = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const order_model_1 = require("../order/order.model");
const product_const_1 = require("./product.const");
const product_model_1 = require("./product.model");
const createProductOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.ProductModel.create(payload);
    return result;
});
const getAllProductFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.QueryBuilder(product_model_1.ProductModel.find()
        .populate("brandAndCategories.brand")
        .populate("brandAndCategories.categories")
        .populate("brandAndCategories.tags"), query);
    const allProducts = productQuery.search(product_const_1.ProductSearchableFields).filter().sort().paginate();
    const [data, meta] = yield Promise.all([
        allProducts.build().exec(),
        productQuery.getMeta()
    ]);
    return {
        data, meta
    };
});
const getProductsByCategoryandTag = (category, tag, slug) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = category ? category.split(",") : [];
    const tags = tag ? tag.split(",") : [];
    const products = yield product_model_1.ProductModel.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'brandAndCategories.categories',
                foreignField: '_id',
                as: 'categoryDetails',
            },
        },
        {
            $lookup: {
                from: 'tags',
                localField: 'brandAndCategories.tags',
                foreignField: '_id',
                as: 'tagDetails',
            },
        },
        {
            $lookup: {
                from: 'brands',
                localField: 'brandAndCategories.brand',
                foreignField: '_id',
                as: 'brandDetails',
            },
        },
        {
            $addFields: {
                brandAndCategories: {
                    brand: { $arrayElemAt: ['$brandDetails', 0] },
                    categories: '$categoryDetails',
                    tags: '$tagDetails',
                },
            },
        },
        {
            $match: Object.assign(Object.assign(Object.assign({ 'description.status': 'publish' }, (categories.length
                ? { 'brandAndCategories.categories.name': { $in: categories } }
                : {})), (slug ? { 'brandAndCategories.categories.slug': slug } : {})), (tags.length
                ? { 'brandAndCategories.tags.name': { $in: tags } }
                : {})),
        },
        {
            $project: {
                categoryDetails: 0,
                tagDetails: 0,
                brandDetails: 0,
            },
        },
    ]);
    return products;
});
const getSingleProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.ProductModel.findById(id)
        .populate("brandAndCategories.brand")
        .populate("brandAndCategories.categories")
        .populate("brandAndCategories.tags");
    return result;
});
const updateProductOnDB = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExist = yield product_model_1.ProductModel.findById(id);
    if (!isProductExist) {
        throw new handleAppError_1.default(404, "Product not found!");
    }
    if (updatedData.deletedImages &&
        updatedData.deletedImages.length > 0 &&
        isProductExist.gallery &&
        isProductExist.gallery.length > 0) {
        const restDBImages = isProductExist.gallery.filter((imageurl) => { var _a; return !((_a = updatedData.deletedImages) === null || _a === void 0 ? void 0 : _a.includes(imageurl)); });
        const updatedGalleryImages = (updatedData.gallery || [])
            .filter((imageurl) => { var _a; return !((_a = updatedData.deletedImages) === null || _a === void 0 ? void 0 : _a.includes(imageurl)); })
            .filter((imageurl) => !restDBImages.includes(imageurl));
        updatedData.gallery = [...restDBImages, ...updatedGalleryImages];
    }
    const updatedProduct = yield product_model_1.ProductModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true, runValidators: true });
    // delete images from cloudinary if they are deleted
    if (updatedData.deletedImages && updatedData.deletedImages.length > 0) {
        yield Promise.all(updatedData.deletedImages.map((imageurl) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(imageurl)));
    }
    if (updatedData.featuredImg && isProductExist.featuredImg) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(isProductExist.featuredImg);
    }
    return updatedProduct;
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.ProductModel.findById(id);
        if (!product) {
            throw new handleAppError_1.default(404, 'Product not found');
        }
        if (product.featuredImg) {
            yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(product.featuredImg);
        }
        if (product.gallery && product.gallery.length > 0) {
            yield Promise.all(product.gallery.map(imageurl => (0, cloudinary_config_1.deleteImageFromCLoudinary)(imageurl)));
        }
        yield product.deleteOne();
    }
    catch (error) {
        console.error(error);
    }
});
const inventoryStats = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const totalProducts = yield product_model_1.ProductModel.countDocuments();
    const totalStock = yield product_model_1.ProductModel.aggregate([
        { $group: { _id: null, total: { $sum: '$productInfo.quantity' } } },
    ]);
    const lowStockItems = yield product_model_1.ProductModel.countDocuments({
        'productInfo.quantity': { $gt: 0, $lt: 10 },
    });
    const outOfStock = yield product_model_1.ProductModel.countDocuments({
        'productInfo.quantity': 0,
    });
    const totalValueAgg = yield product_model_1.ProductModel.aggregate([
        {
            $group: {
                _id: null,
                totalValue: {
                    $sum: {
                        $multiply: ['$productInfo.salePrice', '$productInfo.quantity'],
                    },
                },
            },
        },
    ]);
    return {
        totalProducts,
        totalStock: ((_a = totalStock[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        lowStockItems,
        outOfStock,
        totalValue: ((_b = totalValueAgg[0]) === null || _b === void 0 ? void 0 : _b.totalValue) || 0,
    };
});
const bestSellingProducts = (categorySlug) => __awaiter(void 0, void 0, void 0, function* () {
    let limit = 10;
    const pipeline = [
        { $unwind: '$orderInfo' },
        // প্রতিটি product কতবার order হয়েছে তা গণনা
        {
            $group: {
                _id: '$orderInfo.productInfo',
                totalSold: { $sum: '$orderInfo.quantity' },
            },
        },
        // বেশি sold products আগে আসবে
        { $sort: { totalSold: -1 } },
        // Product details lookup
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product',
            },
        },
        { $unwind: '$product' },
        // Brand populate
        {
            $lookup: {
                from: 'brands',
                localField: 'product.brandAndCategories.brand',
                foreignField: '_id',
                as: 'product.brandAndCategories.brand',
            },
        },
        // Categories populate
        {
            $lookup: {
                from: 'categories',
                localField: 'product.brandAndCategories.categories',
                foreignField: '_id',
                as: 'product.brandAndCategories.categories',
            },
        },
        // Tags populate
        {
            $lookup: {
                from: 'tags',
                localField: 'product.brandAndCategories.tags',
                foreignField: '_id',
                as: 'product.brandAndCategories.tags',
            },
        },
        // Optional: categorySlug filter
        ...(categorySlug
            ? [
                {
                    $match: {
                        'product.brandAndCategories.categories.slug': categorySlug,
                    },
                },
            ]
            : []),
        { $replaceRoot: { newRoot: '$product' } },
        { $limit: limit },
    ];
    const result = yield order_model_1.OrderModel.aggregate(pipeline);
    return result;
});
exports.bestSellingProducts = bestSellingProducts;
exports.productServices = {
    createProductOnDB,
    getSingleProductFromDB,
    getAllProductFromDB,
    updateProductOnDB,
    getProductsByCategoryandTag,
    deleteProduct,
    inventoryStats,
    bestSellingProducts: exports.bestSellingProducts
};
