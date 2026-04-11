import { AuthServices } from "./auth.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import config from "../../config";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/createTokens";
import { TUser } from "../user/user.interface";
import AppError from "../../errors/handleAppError";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { userRoles } from "../user/user.const";
import { CustomerModel } from "../customer/customer.model";

const registerUser = catchAsync(async (req, res) => {
  const userInfo = {
    ...req.body,
    auths: {
      provider: "email",
      providerId: req.body.email,
    },
  };

  const result = await AuthServices.registerUserOnDB(userInfo);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User has been registered successfully!",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const userInfo = req?.body;
  const result = await AuthServices.loginUserFromDB(userInfo);

  const tokenInfo = createUserTokens(result as TUser);

  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged in Successfully!",
    data: result,
  });
});

const loginUserUsingProvider = catchAsync(async (req, res) => {
  const userInfo = req?.body;
  const result = await AuthServices.loginUserUsingProviderFromDB(userInfo);

  sendResponse(
    res.cookie("accessToken", result?.accessToken, {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    }),
    {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged in Successfully!",
      data: result?.user,
    }
  );
});

const logOutUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await AuthServices.logoutUserFromDB(userId);

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
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged Out Successfully!",
    data: result,
  });
});

const googleCallbackController = catchAsync(async (req, res) => {
  let redirectTo = req.query.state ? (req.query.state as string) : "";

  if (redirectTo.startsWith("/")) {
    redirectTo = redirectTo.slice(1);
  }
  const user = req.user as TUser;

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
  }

  const tokenInfo = createUserTokens(user);

  setAuthCookie(res, tokenInfo);

  if (user?.role === "customer") {
    if (redirectTo) {
      return res.redirect(`${config.FRONTEND_URL}/${redirectTo}`);
    } else {
      return res.redirect(`${config.FRONTEND_URL}`);
    }
  } else {
    if (redirectTo) {
      return res.redirect(`${config.FRONTEND_URL_ADMIN}/${redirectTo}`);
    } else {
      return res.redirect(`${config.FRONTEND_URL_ADMIN}`);
    }
  }
});



const gatMe = catchAsync(async (req, res) => {
  const decodedUser = req.user;

  const me = await AuthServices.getMe(decodedUser as any);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Data received Successfully!",
    data: me,
  });
});


const googleData = catchAsync(async (req, res) => {
  const decodedUser = req.user;
   const me = await AuthServices.googlegetMe(decodedUser as any);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Data received Successfully!",
    data: me,
  });
})


export const AuthController = {
  registerUser,
  loginUser,
  logOutUser,
  loginUserUsingProvider,
  googleCallbackController,
  gatMe,
  googleData
};
