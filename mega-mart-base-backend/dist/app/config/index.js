"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), '.env')) });
exports.default = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    FRONTEND_URL_ADMIN: process.env.FRONTEND_URL_ADMIN,
    EXPRESS_SESSION: process.env.EXPRESS_SESSION,
    SSL: {
        STORE_ID: process.env.SSL_STORE_ID,
        STORE_PASS: process.env.SSL_STORE_PASS,
        SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
        SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
        SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL,
        SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
        SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
        SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
        SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
        SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
        SSL_IPN_URL: process.env.SSL_IPN_URL,
    },
    EMAIL_SENDER: {
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_FROM: process.env.SMTP_FROM,
    },
};
