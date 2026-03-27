import { z } from "zod";
import { possibleGenders, userRoles, userStatus } from "./user.const";

export const createUserZodSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z.string().email("Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters long"),

  role: z.enum([...userRoles] as [string, ...string[]]).optional(),
  image: z.string().optional(),

  gender: z.enum([...possibleGenders] as [string, ...string[]]).optional(),

  contactNo: z.string().optional(),

  bio: z.string().optional(),

  status: z.enum([...userStatus] as [string, ...string[]]).optional(),

  walletPoint: z.number().optional(),

  socials: z.array(z.string()).optional(),

  cardInfo: z.any().optional().nullable(),
});

export const forgetPasswordZodSchema = z.object({
    email: z.string().email("Invalid email format"),
});

export const resetPasswordZodSchema = z.object({
    email: z.string().email("Invalid email format"),
    token: z.string(),
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});



export const updateUserZodSchema = z.object({
  name: z.string(),
  email: z.string().email('Invalid email format'),
  image: z.string().optional(),
  contactNo: z.string(),
  bio: z.string(),

}).partial();