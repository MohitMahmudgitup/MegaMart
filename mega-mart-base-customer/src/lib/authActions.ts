/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  useGetMeQuery,
  useLoginUserMutation,
  useLogoutMutation,
  useRegisterUserMutation,
} from "@/redux/featured/auth/authApi";
import { getSession, signIn, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { logoutUser, setUser } from "@/redux/featured/auth/authSlice";
import { useCreateCustomerMutation } from "@/redux/featured/customer/customerApi";
import { useRouter } from 'next/navigation';

export function useAuthHandlers() {
    const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser] = useRegisterUserMutation();
  const [createCustomer] = useCreateCustomerMutation();
  const { data: user } = useGetMeQuery(undefined);
  const [logout] = useLogoutMutation();
  const handleRegister = async (data: {
    name?: string;
    email: string;
    password: string;
  }) => {
    try {
      const registerData = await registerUser(data).unwrap();
      const payload = {
        userId: registerData?.data?._id,
      };
      const res = await createCustomer(payload).unwrap();

      toast.success("Registration successful!");
    } catch (err: any) {
      throw new Error(err?.data?.message || "Registration failed");
    }
  };

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const res = await loginUser(data).unwrap();

      if (res?.success) {
        dispatch(setUser(res.data));
        if (res.data.role === 'customer') { 
          toast.success("Login successful");
          router.push('/');
        }
      } else {
        toast.error(res.message || "Login failed");
      }
      
      if (res.data.role !== 'customer') {
        const handleLogout = async () => {
            if (res.data?._id) {
              try {
                await logout(res.data?._id).unwrap();
              } catch (err) {
                console.error(err);
              }
            }
          dispatch(logoutUser());
          toast.error("You can't login as a Customer")
            await signOut({ callbackUrl: "/auth/login" });
        };
        
        handleLogout()
      }
      
    } catch (error) {
      console.log(error)
      toast.error("Login failed — no session found");
    }
  };

  return { handleRegister, handleLogin };
}
