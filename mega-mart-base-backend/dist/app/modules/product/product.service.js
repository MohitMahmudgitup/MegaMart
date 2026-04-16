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
exports.productServices = exports.bestSellingProducts = exports.getProductsByCategoryandSubcategory = void 0;
const mongoose_1 = require("mongoose");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const order_model_1 = require("../order/order.model");
const tags_model_1 = require("../tags/tags.model");
const product_model_1 = require("./product.model");
const createProductOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.ProductModel.create(payload);
    return result;
});
const getAllProductFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // 1️⃣ Fetch all products with populate
    const products = yield product_model_1.ProductModel.find()
        .populate("brandAndCategories.brand")
        .populate("brandAndCategories.categories")
        .populate("brandAndCategories.tags")
        .populate("brandAndCategories.subCategories")
        .lean(); // lean() converts mongoose docs to plain objects
    // 2️⃣ Attach subCategories inside each category
    const data = products.map((product) => {
        const { categories, subCategories } = product.brandAndCategories || {};
        const newCategories = categories === null || categories === void 0 ? void 0 : categories.map((cat) => (Object.assign(Object.assign({}, cat), { subCategories: subCategories || [] })));
        return Object.assign(Object.assign({}, product), { brandAndCategories: Object.assign(Object.assign({}, product.brandAndCategories), { categories: newCategories, subCategories: undefined }) });
    });
    return {
        data,
        meta: { total: data.length }, // optional, you can add pagination meta
    };
});
// productServices.ts
const getProductsByCategoryandSubcategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = new mongoose_1.Types.ObjectId(id);
    const products = yield product_model_1.ProductModel.aggregate([
        // 🔹 Lookup Categories
        {
            $lookup: {
                from: "categories",
                localField: "brandAndCategories.categories",
                foreignField: "_id",
                as: "categoryData",
            },
        },
        // 🔹 Lookup SubCategories (direct from product)
        {
            $lookup: {
                from: "subcategories",
                localField: "brandAndCategories.subCategories",
                foreignField: "_id",
                as: "subCategoryData",
            },
        },
        // 🔹 Match Category / Tag / SubCategory
        {
            $match: {
                $or: [
                    { "brandAndCategories.categories": queryId },
                    { "brandAndCategories.tags": queryId },
                    { "brandAndCategories.subCategories": queryId },
                ],
            },
        },
        // 🔹 Attach subCategories inside each category
        {
            $addFields: {
                "brandAndCategories.categories": {
                    $map: {
                        input: "$categoryData",
                        as: "cat",
                        in: {
                            $mergeObjects: [
                                "$$cat",
                                {
                                    subCategories: "$subCategoryData", // 👈 attach here
                                },
                            ],
                        },
                    },
                },
            },
        },
        // 🔹 Remove extra fields
        {
            $project: {
                categoryData: 0,
                subCategoryData: 0,
                "brandAndCategories.subCategories": 0,
            },
        },
    ]);
    return products;
});
exports.getProductsByCategoryandSubcategory = getProductsByCategoryandSubcategory;
const getSingleProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const result = yield product_model_1.ProductModel.findById(id)
        .select("-vendorId -shopId")
        .populate({
        path: "brandAndCategories.brand",
        select: "name -_id", // ✅ only name
    })
        .populate({
        path: "brandAndCategories.categories",
        select: "name _id", // ✅ only name
    })
        .populate({
        path: "brandAndCategories.subCategories",
        select: "name -_id", // ✅ only name
    })
        .populate({
        path: "brandAndCategories.tags",
        select: "name -_id", // ✅ only name
    });
    if (!result)
        return null;
    // 🔥 Manual cleanup
    const obj = result.toObject();
    return Object.assign(Object.assign({}, obj), { 
        // description clean
        description: {
            name: (_a = obj.description) === null || _a === void 0 ? void 0 : _a.name,
            unit: (_b = obj.description) === null || _b === void 0 ? void 0 : _b.unit,
            description: (_c = obj.description) === null || _c === void 0 ? void 0 : _c.description,
            shortdescription: (_d = obj.description) === null || _d === void 0 ? void 0 : _d.shortdescription,
        }, 
        // productInfo clean
        productInfo: {
            price: (_e = obj.productInfo) === null || _e === void 0 ? void 0 : _e.price,
            salePrice: (_f = obj.productInfo) === null || _f === void 0 ? void 0 : _f.salePrice,
            quantity: (_g = obj.productInfo) === null || _g === void 0 ? void 0 : _g.quantity,
            sku: (_h = obj.productInfo) === null || _h === void 0 ? void 0 : _h.sku,
            width: (_j = obj.productInfo) === null || _j === void 0 ? void 0 : _j.width,
            height: (_k = obj.productInfo) === null || _k === void 0 ? void 0 : _k.height,
            length: (_l = obj.productInfo) === null || _l === void 0 ? void 0 : _l.length,
            isExternal: (_m = obj.productInfo) === null || _m === void 0 ? void 0 : _m.isExternal,
            external: (_o = obj.productInfo) === null || _o === void 0 ? void 0 : _o.external,
        }, 
        // specifications clean
        specifications: (_p = obj.specifications) === null || _p === void 0 ? void 0 : _p.map((spec) => ({
            key: spec.key,
            value: spec.value,
        })) });
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
        { $unwind: "$orderInfo" },
        // total sold count
        {
            $group: {
                _id: "$orderInfo.productInfo",
                totalSold: { $sum: "$orderInfo.quantity" },
            },
        },
        { $sort: { totalSold: -1 } },
        // product lookup
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        // optional category filter
        ...(categorySlug
            ? [
                {
                    $match: {
                        "product.brandAndCategories.categories.slug": categorySlug,
                    },
                },
            ]
            : []),
        // root replace
        { $replaceRoot: { newRoot: "$product" } },
        // 🔥 only প্রয়োজনীয় data return
        {
            $project: {
                _id: 1,
                featuredImg: 1,
                "description.name": 1,
            },
        },
        { $limit: limit },
    ];
    const result = yield order_model_1.OrderModel.aggregate(pipeline);
    return result;
});
exports.bestSellingProducts = bestSellingProducts;
// -------------------------------------------------------------data Manager ------------------------------------------------
const NewArrivalsListData = () => __awaiter(void 0, void 0, void 0, function* () {
    const tag = yield tags_model_1.TagModel.findOne({ slug: "New-Arrivals" }).lean();
    if (!tag)
        return [];
    const products = yield product_model_1.ProductModel.find({
        "brandAndCategories.tags": tag._id
    })
        .populate("brandAndCategories.categories", "name")
        .select("featuredImg description.name description.description productInfo.price productInfo.salePrice")
        .lean();
    return products;
});
const productcollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.ProductModel.find()
        .populate("brandAndCategories.categories", "name")
        .populate("brandAndCategories.tags", "name")
        .populate("brandAndCategories.brand", "name")
        .select("featuredImg description.name  productInfo.price productInfo.salePrice")
        .lean();
    return products;
});
const getSingleEditProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.ProductModel.findById(id)
        .populate("brandAndCategories.brand")
        .populate("brandAndCategories.categories")
        .populate("brandAndCategories.subCategories")
        .populate("brandAndCategories.tags");
    return result;
});
const getCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.ProductModel.find()
        .populate({
        path: "brandAndCategories.categories",
        select: "name slug image bannerImg isFeatured createdAt updatedAt subCategories",
        populate: {
            path: "subCategories", // প্রতিটি category-এর ভিতরে subCategories populate
            select: "name slug details image bannerImg isFeatured createdAt updatedAt",
        },
    })
        .lean(); // plain JS object
    const data = products.map((product) => {
        const { categories } = product.brandAndCategories || {};
        const newCategories = categories === null || categories === void 0 ? void 0 : categories.map((cat) => ({
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            image: cat.image,
            bannerImg: cat.bannerImg,
            isFeatured: cat.isFeatured,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
            subCategories: cat.subCategories || [],
        }));
        return {
            brandAndCategories: {
                categories: newCategories,
            },
        };
    });
    return data;
});
exports.productServices = {
    createProductOnDB,
    getSingleProductFromDB,
    getAllProductFromDB,
    updateProductOnDB,
    getProductsByCategoryandSubcategory: exports.getProductsByCategoryandSubcategory,
    deleteProduct,
    inventoryStats,
    bestSellingProducts: exports.bestSellingProducts,
    NewArrivalsListData,
    productcollection,
    getSingleEditProductFromDB,
    getCategory
};
