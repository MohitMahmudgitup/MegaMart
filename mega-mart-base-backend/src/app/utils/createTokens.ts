
import config from "../config";
import { TUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";





export const createUserTokens = (user: Partial<TUser>) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  }

  const accessToken = generateToken(
    payload,
    config.jwt_access_secret as string, 
    config.JWT_ACCESS_EXPIRES as string
  );
  const refreshToken = generateToken(payload, config.JWT_REFRESH_SECRET as string, config.JWT_REFRESH_EXPIRES as string);

  return {
    accessToken,
    refreshToken
  }
}

