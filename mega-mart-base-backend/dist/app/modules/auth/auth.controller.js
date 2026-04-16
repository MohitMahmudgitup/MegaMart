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
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const config_1 = __importDefault(require("../../config"));
const setCookie_1 = require("../../utils/setCookie");
const createTokens_1 = require("../../utils/createTokens");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_codes_1 = require("http-status-codes");
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = Object.assign(Object.assign({}, req.body), { auths: {
            provider: "email",
            providerId: req.body.email,
        } });
    const result = yield auth_service_1.AuthServices.registerUserOnDB(userInfo);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User has been registered successfully!",
        data: result,
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req === null || req === void 0 ? void 0 : req.body;
    const result = yield auth_service_1.AuthServices.loginUserFromDB(userInfo);
    const tokenInfo = (0, createTokens_1.createUserTokens)(result);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User Logged in Successfully!",
        data: result,
    });
}));
const loginUserUsingProvider = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req === null || req === void 0 ? void 0 : req.body;
    const result = yield auth_service_1.AuthServices.loginUserUsingProviderFromDB(userInfo);
    (0, sendResponse_1.default)(res.cookie("accessToken", result === null || result === void 0 ? void 0 : result.accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
    }), {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User Logged in Successfully!",
        data: result === null || result === void 0 ? void 0 : result.user,
    });
}));
const logOutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield auth_service_1.AuthServices.logoutUserFromDB(userId);
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User Logged Out Successfully!",
        data: result,
    });
}));
const googleCallbackController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new handleAppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User Not Found");
    }
    const tokenInfo = (0, createTokens_1.createUserTokens)(user);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    if ((user === null || user === void 0 ? void 0 : user.role) === "customer") {
        if (redirectTo) {
            return res.redirect(`${config_1.default.FRONTEND_URL}/${redirectTo}`);
        }
        else {
            return res.redirect(`${config_1.default.FRONTEND_URL}`);
        }
    }
    else {
        if (redirectTo) {
            return res.redirect(`${config_1.default.FRONTEND_URL_ADMIN}/${redirectTo}`);
        }
        else {
            return res.redirect(`${config_1.default.FRONTEND_URL_ADMIN}`);
        }
    }
}));
const gatMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedUser = req.user;
    const me = yield auth_service_1.AuthServices.getMe(decodedUser);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Data received Successfully!",
        data: me,
    });
}));
const googleData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedUser = req.user;
    const me = yield auth_service_1.AuthServices.googlegetMe(decodedUser);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Data received Successfully!",
        data: me,
    });
}));
exports.AuthController = {
    registerUser,
    loginUser,
    logOutUser,
    loginUserUsingProvider,
    googleCallbackController,
    gatMe,
    googleData
};
