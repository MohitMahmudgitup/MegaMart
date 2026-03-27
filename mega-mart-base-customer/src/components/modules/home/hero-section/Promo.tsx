"use client";

import { ArrowUpRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Banner {
  _id: string;
  title: string;
  subTitle?: string;
  image: string;
  buttonText?: string;
  discount?: number;
  isActive?: boolean;
  buttonLink?: string;
}

const Promo = ({ banners }: { banners: Banner[] }) => {
  const bannerList = Array.isArray(banners) ? banners : [];

  // 🔗 Dynamic link helper
  const getLink = (item: Banner | undefined, fallback = "/category/all") => {
    return item?.buttonLink || fallback;
  };

  console.log(bannerList);
  

  return (
    <section className="grid grid-cols-1 gap-2 md:gap-4">
      {/* Top collage */}
      <div className="grid grid-cols-12 gap-2 md:gap-4 h-28 md:h-[196px] xl:h-60">
        {/* Left Top Banner */}
        <Link
          href={getLink(bannerList[0])}
          className="col-span-7 h-full relative bg-gradient-to-r from-[#E0E1FC] to-[#F1ECD7] rounded-[20px] overflow-hidden group"
        >
          <div className="z-10 absolute left-4 top-4 md:top-10 md:left-10 text-black">
            <p className="text-[8px] md:text-sm lg:text-base xl:text-lg truncate max-w-[90%]">
              {bannerList[0]?.subTitle || "Picked Every item With Care"}
            </p>
            <h2 className="text-xs md:text-2xl xl:text-3xl font-semibold mt-1 truncate max-w-[90%]">
              {bannerList[0]?.title || "Your Must try"}
            </h2>
            {bannerList[0]?.buttonText && (
              <button className="mt-16 bg-white p-2 rounded-full shadow-md group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-5 h-5 lg:w-8 lg:h-8" />
              </button>
            )}
          </div>
          <Image
            src={
              bannerList[0]?.image ||
              "https://res.cloudinary.com/dvbnagad5/image/upload/v1757584103/model_alvk2k.png"
            }
            alt={bannerList[0]?.title || "Promo Banner"}
            fill
            className="object-contain object-top transition-transform duration-500 group-hover:scale-110"
            priority
          />
        </Link>

        {/* Right Top Banner */}
        <Link
          href={getLink(bannerList[1])}
          className="col-span-5 h-full relative bg-gradient-to-r from-[#F1ECD7] to-[#E0E1FC] rounded-[20px] overflow-hidden group"
        >
          <div className="z-10 absolute top-2 left-2 md:top-4 md:left-4 text-black">
            <span className="bg-black text-white text-[10px] md:text-xs xl:text-base px-2 py-0.5 md:px-3 md:py-1 rounded-full">
              {bannerList[1]?.title || "Men Shirt"}
            </span>
            <h2 className="text-xs md:text-2xl xl:text-2xl font-bold mt-2 truncate max-w-[90%]">
              {bannerList[1]?.subTitle || "60% Off"}
            </h2>
            {bannerList[1]?.buttonText && (
              <button className="mt-2 md:mt-24 bg-white p-2 rounded-full shadow group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-5 h-5 lg:w-8 lg:h-8" />
              </button>
            )}
          </div>
          <Image
            src={
              bannerList[1]?.image ||
              "https://res.cloudinary.com/dvbnagad5/image/upload/v1757584102/man-model_eygmbw.png"
            }
            alt={bannerList[1]?.title || "Promo Banner"}
            fill
            className="object-contain object-bottom transition-transform duration-500 group-hover:scale-110"
            priority
          />
        </Link>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 h-48 md:h-[410px] xl:h-[450px]">
        {/* Left Column */}
        <Link
          href={getLink(bannerList[2])}
          className="h-full relative rounded-[20px] bg-white overflow-hidden group"
        >
          <Image
            src={
              bannerList[2]?.image ||
              "https://res.cloudinary.com/dvbnagad5/image/upload/v1757584100/girl_ksuyq4.png"
            }
            alt={bannerList[2]?.title || "Girl"}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            priority
          />
          {bannerList[2]?.buttonText && (
            <button className="absolute bottom-4 left-2 md:left-4 bg-white p-2 rounded-full shadow group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-5 h-5 lg:w-8 lg:h-8" />
            </button>
          )}
        </Link>

        {/* Middle Column */}
        <div className="flex flex-col h-full gap-2 md:gap-4">
          {/* Top image */}
          <Link
            href={getLink(bannerList[3])}
            className="h-1/2 relative rounded-[20px] bg-white overflow-hidden group"
          >
            <Image
              src={
                bannerList[3]?.image ||
                "https://res.cloudinary.com/dvbnagad5/image/upload/v1757584096/watch_dazrn2.png"
              }
              alt={bannerList[3]?.title || "Watch"}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
              priority
            />
            {bannerList[3]?.buttonText && (
              <button className="absolute bottom-2 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-[#CDCDCD61] px-2 py-1 md:px-6 md:py-3 rounded-md md:rounded-[12px] flex items-center gap-2 text-[10px] md:text-sm font-medium shadow whitespace-nowrap group-hover:bg-white/90 transition">
                {bannerList[3].buttonText} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </Link>

          {/* Bottom image */}
          <Link
            href={getLink(bannerList[4])}
            className="h-1/2 relative rounded-[20px] bg-gradient-to-br from-[#FFC66B] via-[#FFC66B] to-[#FFFFFF] overflow-hidden group"
          >
            <Image
              src={
                bannerList[4]?.image ||
                "https://res.cloudinary.com/dvbnagad5/image/upload/v1757584099/Footwear_tifpdg.png"
              }
              alt={bannerList[4]?.title || "Shoes"}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
              priority
            />
            {bannerList[4]?.buttonText && (
              <button className="absolute bottom-2 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-[#CDCDCD61] px-2 py-1 md:px-6 md:py-3 rounded-md md:rounded-[12px] flex items-center gap-2 text-[10px] md:text-sm font-medium shadow whitespace-nowrap group-hover:bg-white/90 transition">
                {bannerList[4].buttonText} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </Link>
        </div>

        {/* Right Column */}
        <Link
          href={getLink(bannerList[5])}
          className="h-full relative rounded-[20px] bg-white overflow-hidden group"
        >
          <Image
            src={
              bannerList[5]?.image ||
              "https://res.cloudinary.com/dvbnagad5/image/upload/v1757584097/women_grubfg.png"
            }
            alt={bannerList[5]?.title || "Woman"}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            priority
          />
          {bannerList[5]?.buttonText && (
            <button className="absolute bottom-4 left-2 md:left-4 bg-white p-2 rounded-full shadow group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-5 h-5 lg:w-8 lg:h-8" />
            </button>
          )}
        </Link>
      </div>
    </section>
  );
};

export default Promo;
