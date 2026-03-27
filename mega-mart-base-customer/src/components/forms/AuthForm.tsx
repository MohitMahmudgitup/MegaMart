'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useAuthHandlers } from '@/lib/authActions';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import InputField from '../shared/InputField';
import { useGetSettingsQuery } from '@/redux/featured/setting/settingAPI';
import ForgetPasswordForm from './ForgetPasswordForm';

type AuthFormProps = {
  type: 'login' | 'register';
};

type FormData = {
  name?: string;
  email: string;
  password: string;
  role?: "vendor";
};

export default function AuthForm({ type }: AuthFormProps) {
  const { data: settings} = useGetSettingsQuery();
  console.log(settings)
  const [forgotPassword, setForgotPassword] = useState(false);

  const site: any = settings?.[0];
  const isLogin = type === 'login';
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { handleRegister, handleLogin } = useAuthHandlers();
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      if (type === 'register') {
        await handleRegister(data);
        router.push('/auth/login');
      } else {
        await handleLogin(data);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  const loginAndRegisterWithGoogle = () => {
    router.push(`${process.env.NEXT_PUBLIC_BASE_API}/auth/google`);
  };

  return (
    <section
      className="min-h-screen flex flex-col  px-4 relative"
    >
      {/* background image */}
      <Image
        src="/abue7.jpg"
        alt="background"
        fill
        className="object-cover absolute inset-0 -z-10 opacity-40"
      />


      <div className='flex 2xl:flex-row  flex-col items-center justify-around flex-1 md:flex-row  w-full py-20'>

        {/* Logo */}
        <Link href="/" className="mb-4 block">
          <div className="relative w-62 sm:w-40 md:w-48 2xl:w-[700] md:w-[400] h-auto aspect-[4/1]">
            <Image
              src={site?.siteLogo ? site?.siteLogo : "/logo.png"}
              alt={site?.siteName || "Logo"}
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>


        {/* Gradient Title */}

        {
          !forgotPassword ? (
            <div className="w-full max-w-md bg-white backdrop-blur-xl border px-6 py-6 border-gray-300 rounded-4xl shadow-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <h3 className=" text-4xl font-semibold tracking-wide">
                  {isLogin ? "LOGIN" : "SIGN UP"}
                </h3>

                {type === 'register' && (
                  <InputField
                    label="Name"
                    id="name"
                    placeholder="Name"
                    register={register("name", { required: true })}
                    error={errors.name && "Name is required"}
                  />
                )}

                <InputField
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  register={register("email", { required: true })}
                  error={errors.email && "Email is required"}
                />

                <div className="relative">
                  <InputField
                    label="Password"
                    id="password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    onIconClick={() => setShowPassword(!showPassword)}
                    register={register("password", {
                      required: "Password is required",
                      validate: value =>
                        value.length >= 6 || "Password must be 6 characters long",
                    })}
                    error={errors.password?.message}
                  />
                </div>

                {/* Remember + Forgot */}
                <div className="flex justify-between items-center text-sm">
                  {/* <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-black" />
                    Remember me
                  </label> */}
                  {type === 'login' && (
                    <div onClick={() => setForgotPassword(true)} className="hover:underline cursor-pointer text-blue-600">
                      Forgot password?
                    </div>
                  )}

                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Submit button */}
                <Button type="submit" className="w-full h-10 rounded-full">
                  {isLogin ? "Login" : "Register"}
                </Button>

                {/* Divider */}
                <div className="flex flex-col items-center gap-4 mt-4">
                  <div className="w-full flex items-center gap-2">
                    <hr className="flex-1 border-gray-300" />
                    <span className="text-gray-500 text-sm">or</span>
                    <hr className="flex-1 border-gray-300" />
                  </div>

                  {/* Google Login */}
                  <Button
                    variant="outline"
                    type="button"
                    onClick={loginAndRegisterWithGoogle}
                    className="justify-center rounded-full w-full h-10"
                  >
                    <Image src="/google.png" alt="google" width={20} height={20} />
                    <span className="ml-2">Continue with Google</span>
                  </Button>
                </div>
              </form>

              {/* Login/Register Switch */}
              <div className="mt-4 text-sm text-center">
                <p>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <Link
                    href={isLogin ? "/auth/register" : "/auth/login"}
                    className="underline underline-offset-4 font-medium text-blue-600"
                  >
                    {isLogin ? "Register" : "Login"}
                  </Link>
                </p>
              </div>
            </div>

          ) : (
            <ForgetPasswordForm
              setForgotPassword={setForgotPassword}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              error ={error}
              loginAndRegisterWithGoogle={loginAndRegisterWithGoogle}
              isLogin={isLogin}
            />


          )
        }


      </div>

    </section>
  );

}
