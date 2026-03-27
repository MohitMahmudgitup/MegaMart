"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserTokens = void 0;
const config_1 = __importDefault(require("../config"));
const jwt_1 = require("./jwt");
const createUserTokens = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const accessToken = (0, jwt_1.generateToken)(payload, config_1.default.jwt_access_secret, config_1.default.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(payload, config_1.default.JWT_REFRESH_SECRET, config_1.default.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken
    };
};
exports.createUserTokens = createUserTokens;
