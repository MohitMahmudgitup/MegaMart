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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const vendor_consts_1 = require("../vendor/vendor.consts");
const user_const_1 = require("./user.const");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const getAllUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.find();
    return result;
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.findById(id);
    //if no user found with the id
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    return result;
});
const getAllAdminFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.find({ role: "admin" });
    return result;
});
const getAdminProfileFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    if (result.role !== "super-admin") {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized User!");
    }
    return result;
});
const getAllVendorFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorQuery = new QueryBuilder_1.default(user_model_1.UserModel.find(), query)
        .search(vendor_consts_1.VendorSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield vendorQuery.modelQuery;
    return result;
});
const updateUserOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findById(id);
    if (!isUserExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User does not Exists!");
    }
    if ((isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email) !== (payload === null || payload === void 0 ? void 0 : payload.email)) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized User!");
    }
    if (payload === null || payload === void 0 ? void 0 : payload.password) {
        payload.password = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    const { email } = payload, updateData = __rest(payload, ["email"]);
    const result = yield user_model_1.UserModel.findByIdAndUpdate(id, updateData, {
        new: true,
    });
    return result;
});
const updateUserRole = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findById(id);
    if (!isUserExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, 'User does not Exists!');
    }
    const result = yield user_model_1.UserModel.findByIdAndUpdate(id, { role: user_const_1.userRole.vendor }, {
        new: true,
    });
    return result;
});
const updateStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findById(id);
    if (!isUserExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User does not Exists!");
    }
    const result = yield user_model_1.UserModel.findByIdAndUpdate(id, { status }, { new: true });
    return result;
});
const forgetPasswordService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findOne({ email });
    if (!user) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_RESET_PASSWORD_KEY, { expiresIn: '1h' });
    //send email
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const mailOptions = {
        from: 'syedmohitmahmudinzmaqm@gmail.com',
        to: email,
        subject: "Password Reset Request",
        html: `<p>Click on this to generate your new password ${process.env.CLIENT_URL}/${token}  to reset your password. This link will expire in 1 hour.</p>`,
    };
    const result = yield transporter.sendMail(mailOptions);
    return result;
});
const resetPasswordService = (token, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!password) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Password is required");
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_RESET_PASSWORD_KEY);
    }
    catch (error) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired reset token");
    }
    const user = yield user_model_1.UserModel.findOne({ email: decoded.email });
    if (!user) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    user.password = password;
    yield user.save();
    return {
        message: "Password reset successfully",
    };
});
const changePasswordService = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findById(userId);
    if (!user) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (!user.password) {
        throw new handleAppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "User password not set");
    }
    const isPasswordCorrect = yield bcrypt_1.default.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Old password is incorrect");
    }
    user.password = newPassword;
    yield user.save();
    return {
        message: "Password changed successfully",
    };
});
exports.UserServices = {
    getAllUserFromDB,
    getSingleUserFromDB,
    getAllAdminFromDB,
    getAllVendorFromDB,
    getAdminProfileFromDB,
    updateUserOnDB,
    updateUserRole,
    updateStatus,
    forgetPasswordService,
    resetPasswordService,
    changePasswordService,
};
