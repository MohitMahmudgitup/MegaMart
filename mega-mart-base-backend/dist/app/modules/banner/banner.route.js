"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerRoute = void 0;
const express_1 = require("express");
const banner_controller_1 = require("./banner.controller");
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const banner_validation_1 = require("./banner.validation");
const router = (0, express_1.Router)();
router.post('/create', multer_config_1.multerUpload.single('image'), (0, validateRequest_1.default)(banner_validation_1.createBannerSchema), banner_controller_1.bannerController.createBanner);
router.patch('/update/:id', multer_config_1.multerUpload.single('image'), (0, validateRequest_1.default)(banner_validation_1.updateBannerSchema), banner_controller_1.bannerController.updateBanner);
router.delete('/delete/:id', banner_controller_1.bannerController.deleteBanner);
router.get('/', banner_controller_1.bannerController.getAllBanners);
exports.bannerRoute = router;
