import AppError from "../../errors/handleAppError";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import QueryBuilder from "../../builder/QueryBuilder";
import { VendorSearchableFields } from "../vendor/vendor.consts";
import { userRole } from "./user.const";
import jwt from "jsonwebtoken";
import nodematerial from "nodemailer";


const getAllUserFromDB = async () => {
  const result = await UserModel.find();

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await UserModel.findById(id);

  //if no user found with the id
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  return result;
};

const getAllAdminFromDB = async () => {
  const result = await UserModel.find({ role: "admin" });
  return result;
};

const getAdminProfileFromDB = async (id: string) => {
  const result = await UserModel.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }
  if (result.role !== "super-admin") {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized User!");
  }
  return result;
};

const getAllVendorFromDB = async (query: Record<string, unknown>) => {
  const vendorQuery = new QueryBuilder(UserModel.find(), query)
    .search(VendorSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await vendorQuery.modelQuery;

  return result;
};

const updateUserOnDB = async (
  id: string,
  payload: Partial<TUser> & Pick<TUser, "email">
) => {
  const isUserExists = await UserModel.findById(id);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not Exists!");
  }

  if (isUserExists?.email !== payload?.email) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized User!");
  }

  if (payload?.password) {
    payload.password = await bcrypt.hash(
      payload?.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  const { email, ...updateData } = payload;

  const result = await UserModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  return result;
};


const updateUserRole = async (
  id: string,
) => {
  const isUserExists = await UserModel.findById(id);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not Exists!');
  }

  const result = await UserModel.findByIdAndUpdate(id, { role: userRole.vendor }, {
    new: true,
  });

  return result;
};

const updateStatus = async (
  id: string,
  status: string
) => {
  const isUserExists = await UserModel.findById(id);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not Exists!");
  }
  const result = await UserModel.findByIdAndUpdate(id, { status }, { new: true });
  return result;
};

const forgetPasswordService = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const token = jwt.sign(
    { email }, process.env.JWT_RESET_PASSWORD_KEY as string, { expiresIn: '1h' }
  );

  //send email
  const transporter = nodematerial.createTransport({
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
  const result = await transporter.sendMail(mailOptions);

  return result;

};

const resetPasswordService = async (token: string, password: string) => {
  if (!password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }

  let decoded: { email: string };

  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_RESET_PASSWORD_KEY as string
    ) as { email: string };
  } catch (error) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired reset token"
    );
  }

  const user = await UserModel.findOne({ email: decoded.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }


  user.password = password;

  await user.save();

  return {
    message: "Password reset successfully",
  };
};

const changePasswordService = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.password) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "User password not set");
  }

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }
  user.password = newPassword;

  await user.save();

  return {
    message: "Password changed successfully",
  };
};


export const UserServices = {
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
