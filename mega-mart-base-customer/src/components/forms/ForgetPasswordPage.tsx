"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useForgetPasswordMutation } from "@/redux/featured/auth/authApi";
import toast from "react-hot-toast";
import ForgetPasswordForm from "./ForgetPasswordForm";

const ForgetPasswordPage = () => {
  const [forgetPassword] = useForgetPasswordMutation();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    try {
      setError("");
      await forgetPassword(data).unwrap();
      toast.success("Reset link sent to your email 📧");
      reset();
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <ForgetPasswordForm
      setForgotPassword={() => {}}
      error={error}
      register={register}
      errors={errors}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
    />
  );
};

export default ForgetPasswordPage;
