import config from '../../config';
import { UserModel } from '../user/user.model';
import { TAuth, TExternalProviderAuth } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AppError from '../../errors/handleAppError';
import httpStatus from 'http-status';
import { StatusCodes } from 'http-status-codes';
import { CustomerModel } from '../customer/customer.model';

//register a user in database
const registerUserOnDB = async (payload: TAuth) => {
  const result = await UserModel.create(payload);
  return result;
};

//login an user with credentials
const loginUserFromDB = async (payload: TAuth) => {
  const isUserExists = await UserModel.findOne({
    email: payload?.email,
  });

  if (!isUserExists) {
    throw Error('User does not exists!');
  }


  if (!isUserExists?.password) {
    throw new Error(
      'This account is registered via Google login. Please use Google login.'
    );
  }

  if (!payload?.password) {
    throw new Error('Password is required');
  }
  // console.log(payload.password)
  // console.log(isUserExists.password)
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    isUserExists.password
  );


  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Wrong Credentials!');
  }

  const user = await UserModel.findByIdAndUpdate(
    isUserExists?._id,
    { status: 'active' },
    { new: true }
  );

  return user;
};

//login an user with credentials
const loginUserUsingProviderFromDB = async (payload: TExternalProviderAuth) => {
  const isUserExists = await UserModel.findOne({ email: payload?.email });

  let user;

  if (!isUserExists) {
    // নতুন user create
    user = await UserModel.create(payload);
  } else {
    user = await UserModel.findByIdAndUpdate(
      isUserExists._id,
      { status: 'active' },
      { new: true }
    );
  }

  // ✅ Customer document আছে কিনা check করো
  const existingCustomer = await CustomerModel.findOne({ userId: user?._id });

  if (!existingCustomer) {
    // ✅ না থাকলে create করো
    await CustomerModel.create({
      userId: user?._id,
      cartItem: [{ userId: user?._id, productInfo: [] }],
      wishlist: [],
      address: [],
      orders: [],
    });
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '7d',
  });

  return {
    user,
    accessToken: token,
  };
};

//logout current user and removing token from cookie
const logoutUserFromDB = async (id: string) => {
  await UserModel.findByIdAndUpdate(id, { new: true });
  return {};
};

const getMe = async (decodedUser: JwtPayload) => {
  const me = await UserModel.findById(decodedUser.userId).select('-password');

  if (!me) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return me;
};

const googlegetMe = async (userId: string) => {
  const customer = await CustomerModel.findOne({ userId }).populate({ path: "userId", select: "name email image" }).lean();

  if (!customer) {
    throw new AppError(404, "Customer not found");
  }

  // 🔥 exact format return
  return {
    userId: customer.userId || [],
    cartItem: customer.cartItem || [],
    address: customer.address || [],
  };
};

export const AuthServices = {
  registerUserOnDB,
  loginUserFromDB,
  logoutUserFromDB,
  loginUserUsingProviderFromDB,
  getMe,
  googlegetMe

};
