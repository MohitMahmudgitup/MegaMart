"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const multer_config_1 = require("../../config/multer.config");
const user_validations_1 = require("./user.validations");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
// import auth from "../../middlewares/auth";
// import { userRole } from "./user.const";
const router = express_1.default.Router();
//individual routes
//get all user
router.get("/", 
// auth(userRole["admin"]),
// auth(userRole["super-admin"]),
user_controller_1.UserControllers.getAllUser);
//get all admin user
router.get("/admins", 
// auth(userRole["super-admin"]),
user_controller_1.UserControllers.getAllAdminUser);
//get all vendor user
router.get("/vendors", 
// auth(userRole["super-admin"]),
user_controller_1.UserControllers.getAllVendorUser);
//get super admin
router.get("/admins/:id", 
// auth(userRole["super-admin"]),
user_controller_1.UserControllers.getSuperAdmin);
router.get("/:id", user_controller_1.UserControllers.getSingleUser);
router.patch('/:id', multer_config_1.multerUpload.single('profile'), (0, validateRequest_1.default)(user_validations_1.updateUserZodSchema), user_controller_1.UserControllers.updateUser);
router.patch('/roleupdate/:id', user_controller_1.UserControllers.updateUserRole);
router.patch('/status-update/:id', user_controller_1.UserControllers.updateStatus);
router.post('/forget-password', user_controller_1.UserControllers.forgetPassword);
router.post('/reset-password/:token', user_controller_1.UserControllers.resetPassword);
router.post('/change-password/:id', user_controller_1.UserControllers.chnagePassword);
exports.UserRoutes = router;
