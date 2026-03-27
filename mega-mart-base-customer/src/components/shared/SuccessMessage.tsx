/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUser } from "@/types/user";
import Link from "next/link";
import React from "react";

type Props = {
  user?: Partial<IUser> | null;
  setIsSuccessModal: any;
};

export default function SuccessMessage({ user, setIsSuccessModal }: Props) {
  return (
    <div>
      <div>
        <div id="modal">
          <div className="fixed inset-0 px-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative mx-auto text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-20 h-20 fill-green-500 absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
                viewBox="0 0 60 60"
              >
                <circle cx="30" cy="30" r="29" data-original="#5edd60" />
                <path
                  fill="#fff"
                  d="m24.262 42.07-6.8-6.642a1.534 1.534 0 0 1 0-2.2l2.255-2.2a1.621 1.621 0 0 1 2.256 0l4.048 3.957 11.353-17.26a1.617 1.617 0 0 1 2.2-.468l2.684 1.686a1.537 1.537 0 0 1 .479 2.154L29.294 41.541a3.3 3.3 0 0 1-5.032.529z"
                  data-original="#ffffff"
                />
              </svg>

              <div className="mt-12">
                <h3 className="text-slate-900 text-2xl font-semibold flex-1">
                  Congratulations!
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  Your vendor account has been successfully created. We will
                  shortly confirm your details through an email.
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    href={"/"}
                    id="closeButton"
                    type="button"
                    className="px-6 py-2.5 mt-10 w-full cursor-pointer rounded-md text-white text-sm font-semibold tracking-wide border-none outline-none bg-green-500 hover:bg-green-600"
                  >
                    Go To Home
                  </Link>{" "}
                  <Link
                    href={
                      "https://mega-mart-base-admin-panel.vercel.app/auth/login"
                    }
                    target="_blank"
                    id="closeButton"
                    type="button"
                    className="px-6 py-2.5 mt-10 w-full cursor-pointer rounded-md text-white text-sm font-semibold tracking-wide border-none outline-none bg-green-500 hover:bg-green-600"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
