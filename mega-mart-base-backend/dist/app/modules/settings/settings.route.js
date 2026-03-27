"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingRoute = void 0;
const express_1 = require("express");
const settings_controller_1 = require("./settings.controller");
const multer_config_1 = require("../../config/multer.config");
const settings_validations_1 = require("./settings.validations");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = (0, express_1.Router)();
router.get('/', settings_controller_1.settingControllers.getSetting);
router.patch('/:id', multer_config_1.multerUpload.fields([
    { name: 'siteLogo', maxCount: 1 },
    { name: 'appInfoBanner', maxCount: 1 },
    { name: 'discountBanner', maxCount: 1 },
]), (0, validateRequest_1.default)(settings_validations_1.updateSiteSettingsZodSchema), settings_controller_1.settingControllers.updateSetting);
exports.settingRoute = router;
