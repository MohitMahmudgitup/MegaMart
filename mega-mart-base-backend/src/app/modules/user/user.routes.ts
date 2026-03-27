import express from "express";
import { UserControllers } from "./user.controller";
import { multerUpload } from "../../config/multer.config";
import { updateUserZodSchema } from "./user.validations";
import validateRequest from "../../middlewares/validateRequest";
// import auth from "../../middlewares/auth";
// import { userRole } from "./user.const";

const router = express.Router();

//individual routes

//get all user
router.get(
  "/",
  // auth(userRole["admin"]),
  // auth(userRole["super-admin"]),
  UserControllers.getAllUser
);

//get all admin user
router.get(
  "/admins",
  // auth(userRole["super-admin"]),
  UserControllers.getAllAdminUser
);

//get all vendor user
router.get(
  "/vendors",
  // auth(userRole["super-admin"]),
  UserControllers.getAllVendorUser
);

//get super admin
router.get(
  "/admins/:id",
  // auth(userRole["super-admin"]),
  UserControllers.getSuperAdmin
);

router.get("/:id", UserControllers.getSingleUser);

router.patch(
  '/:id',
  multerUpload.single('profile'),
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser
);


router.patch(
  '/roleupdate/:id',
  UserControllers.updateUserRole
);

router.patch(
  '/status-update/:id',
  UserControllers.updateStatus
);

router.post(
  '/forget-password',
  UserControllers.forgetPassword
);

router.post(
  '/reset-password/:token',
  UserControllers.resetPassword
);

router.post(
  '/change-password/:id',
  UserControllers.chnagePassword
);


export const UserRoutes = router;
