
import InputField from '../shared/InputField'
import { Button } from '../ui/button'
import Link from 'next/dist/client/link'
import { useForgetPasswordMutation } from "@/redux/featured/auth/authApi";
import toast from 'react-hot-toast';
import { useState } from 'react';

const ForgetPasswordForm = ({ setForgotPassword, error, isLogin, register, errors, handleSubmit }: any) => {
  const [forgetPassword] = useForgetPasswordMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data: { email: string }) => {
    try {
      console.log("send")
      await forgetPassword(data).unwrap();
      toast.success("Reset link sent to your email 📧");
      setShowSuccess(true);

    } catch (err: any) {
      console.log(err);
    }
  }


  return (

    showSuccess ? (

      <div className="w-full max-w-md bg-white backdrop-blur-xl border px-6 py-6 border-gray-300 rounded-4xl shadow-lg">

        <h3 className=" text-2xl font-semibold tracking-wide mb-4">
          Check your email
        </h3>
        <p className="mb-6">We have sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password.</p>
        <Button onClick={() => setForgotPassword(false)} className="w-full h-10 rounded-full">
          Back to Login
        </Button>
      </div>

    ) : (
          <div className="w-full max-w-md bg-white backdrop-blur-xl border px-6 py-6 border-gray-300 rounded-4xl shadow-lg">

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        <h3 className=" text-2xl font-semibold tracking-wide">
          Forgot password
        </h3>
        <InputField
          label="Email"
          id="email"
          type="email"
          placeholder="Email"
          register={register("email", { required: true })}
          error={errors.email && "Email is required"}
        />


        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit button */}
        <Button type="submit" className="w-full h-10 rounded-full">
          Send Reset Link
        </Button>


      </form>

      {/* Login/Register Switch */}
      <div className="mt-4 text-sm text-center">
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}


          <Link onClick={() => setForgotPassword(false)}
            href={isLogin ? "/auth/register" : "/auth/login"}
            className="underline underline-offset-4 font-medium text-blue-600"
          >
            {isLogin ? "Register" : "Login"}
          </Link>


        </p>
      </div>
    </div>
    )
 
  )
}

export default ForgetPasswordForm
