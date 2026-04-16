"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const brands_controller_1 = require("./brands.controller");
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const brands_validation_1 = require("./brands.validation");
const router = express_1.default.Router();
router.get("/", brands_controller_1.brandsControllers.getAllBrands);
router.get("/:id", brands_controller_1.brandsControllers.getSingleBrand);
router.post('/create-brand', multer_config_1.multerUpload.fields([
    { name: 'gridImage', maxCount: 1 },
    { name: 'sliderImage', maxCount: 1 },
    { name: 'iconImage', maxCount: 1 },
]), (0, validateRequest_1.default)(brands_validation_1.createBrandZodSchema), brands_controller_1.brandsControllers.createBrand);
router.patch('/update-brand/:id', multer_config_1.multerUpload.fields([
    { name: 'gridImage', maxCount: 1 },
    { name: 'sliderImage', maxCount: 1 },
    { name: 'iconImage', maxCount: 1 },
]), (0, validateRequest_1.default)(brands_validation_1.updateBrandZodSchema), brands_controller_1.brandsControllers.updateBrand);
router.get('/products/:id', brands_controller_1.brandsControllers.getProductsByBrand);
router.delete('/delete/:id', brands_controller_1.brandsControllers.deleteBrand);
router.get('/type/slider-images', brands_controller_1.brandsControllers.getsliderImage);
exports.BrandRoutes = router;
