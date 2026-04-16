"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_controller_1 = require("./product.controller");
const product_validations_1 = require("./product.validations");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router.post('/create-product', multer_config_1.multerUpload.fields([
    { name: 'galleryImagesFiles', maxCount: 20 },
    { name: 'featuredImgFile', maxCount: 1 },
]), (0, validateRequest_1.default)(product_validations_1.createProductZodSchema), product_controller_1.createProduct);
router.get("/", product_controller_1.getAllProduct);
router.get('/best-selling-products', product_controller_1.bestSellingProducts);
router.get("/category/:id", product_controller_1.getProductsByCategoryandsubcategory);
router.get('/inventory/stats', product_controller_1.inventoryStats);
router.get("/:id", product_controller_1.getSingleProduct);
router.patch('/update-product/:id', multer_config_1.multerUpload.fields([
    { name: 'galleryImagesFiles', maxCount: 20 },
    { name: 'featuredImgFile', maxCount: 1 },
]), (0, validateRequest_1.default)(product_validations_1.updateProductZodSchema), product_controller_1.updateProduct);
router.delete('/delete-product/:id', product_controller_1.deleteProduct);
// ---------------------------------------- data Manager ------------------------------------------------
router.get('/type/new-arrivals', product_controller_1.newArrivalsListData);
router.get('/type/product-collection', product_controller_1.productcollections);
router.get('/edit/:id', product_controller_1.getSingleEditProduct);
exports.ProductRoutes = router;
