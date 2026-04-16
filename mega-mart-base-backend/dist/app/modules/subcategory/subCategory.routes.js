"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const subCategory_controller_1 = require("./subCategory.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const subCategory_validations_1 = require("./subCategory.validations");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router.get("/", subCategory_controller_1.subCategoryControllers.getAllsubCategory);
router.get("/:id", subCategory_controller_1.subCategoryControllers.getSinglesubCategory);
router.post('/create-subcategory', multer_config_1.multerUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'bannerImg', maxCount: 1 },
]), (0, validateRequest_1.default)(subCategory_validations_1.createCategoryZodSchema), subCategory_controller_1.subCategoryControllers.createsubCategory);
// router.patch(
//   '/edit-category/:id',
//   multerUpload.fields([
//     { name: 'image', maxCount: 1 },
//     { name: 'bannerImg', maxCount: 1 },
//   ]),
//   validateRequest(updateCategoryZodSchema),
//   categoryControllers.editCategory
// );
// router.delete("/delete-category/:id", categoryControllers.deleteCategory);
exports.SubCategoryRoutes = router;
