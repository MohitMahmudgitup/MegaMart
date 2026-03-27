"use client"
// import { Player } from "@lottiefiles/react-lottie-player";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-300 px-6">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-xl max-w-6xl w-full min-h-[75vh] grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* Left Side — Text */}
        <div className="flex flex-col justify-center p-10 md:p-16 text-left">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Oops....</h2>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Page not found
          </h1>
          <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-md">
            This page doesn’t exist or was removed! <br />
            We suggest you go back to the homepage.
          </p>

          <Link href="/" passHref>
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
              Back to Home
            </button>
          </Link>
        </div>

        {/* Right Side — Lottie Animation
        <div className="flex items-center justify-center bg-white p-8 md:p-12">
          <Player
            autoplay
            loop
            src="/lottie/404 blue.json"
            style={{ height: 350, width: 350 }}
          />
        </div> */}
      </div>
    </div>
  );
};

export default NotFound;
