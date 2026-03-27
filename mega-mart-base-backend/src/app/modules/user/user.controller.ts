import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserServices } from "./user.service";

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All user data retrieve successfully!",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User data retrieve successfully!",
    data: result,
  });
});

const getAllAdminUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllAdminFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All admin data retrieve successfully!",
    data: result,
  });
});

const getSuperAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.getAdminProfileFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Super admin data retrieve successfully!",
    data: result,
  });
});

const getAllVendorUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllVendorFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All vendor data retrieve successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const id = req.params.id;
 const userData = {
   ...req.body,
 };

 if (req.file?.path) {
   userData.image = req.file?.path;
 }
  const result = await UserServices.updateUserOnDB(id, userData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully!",
    data: result,
  });
});


const updateUserRole = catchAsync(async (req, res) => {
  
  const result = await UserServices.updateUserRole(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully!',
    data: result,
  });
});


const updateStatus = catchAsync(async (req, res) => {
  const { status } = req.body; 

  const result = await UserServices.updateStatus(req.params.id, status);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully!",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const result = await UserServices.forgetPasswordService(email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset link sent successfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const result = await UserServices.resetPasswordService(token, password);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully!",
    data: result,
  });
});


const chnagePassword = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;
  const result = await UserServices.changePasswordService(
    userId,
    oldPassword,
    newPassword
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully!",
    data: result,
  });
});

export const UserControllers = {
  getSingleUser,
  getAllUser,
  getAllAdminUser,
  getSuperAdmin,
  getAllVendorUser,
  updateUser,
  updateUserRole,
  updateStatus,
  forgetPassword,
  resetPassword,
  chnagePassword,
};
