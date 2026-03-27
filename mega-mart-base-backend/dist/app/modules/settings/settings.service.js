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
exports.settingServices = exports.updateSettingIntoDB = void 0;
const http_status_codes_1 = require("http-status-codes");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const settings_model_1 = require("./settings.model");
const getSettingIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_model_1.SiteSettingsModel.find();
    return result;
});
const updateSettingIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSetting = yield settings_model_1.SiteSettingsModel.findById(id);
    if (!existingSetting) {
        throw new handleAppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Settings not found!');
    }
    const updatedSetting = yield settings_model_1.SiteSettingsModel.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    return updatedSetting;
});
exports.updateSettingIntoDB = updateSettingIntoDB;
exports.settingServices = {
    getSettingIntoDB,
    updateSettingIntoDB: exports.updateSettingIntoDB,
};
