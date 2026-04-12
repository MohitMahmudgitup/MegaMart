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

  const getLink = (item: Banner | undefined, fallback = "/category/all") => {
    return item?.buttonLink || fallback;
  };

  return (
    <section className="grid grid-cols-1 gap-2 md:gap-4">
      {/* ── TOP ROW ── */}
      <div className="grid grid-cols-12 gap-2 md:gap-4 h-28 md:h-[196px] xl:h-60">

        {/* Banner 0 — Left Top */}
        <Link
          href={getLink(bannerList[0])}
          style={{ animationDelay: "0.05s" }}
          className="col-span-7 h-full relative rounded-[20px] overflow-hidden group animate-slideUp"
        >
          {/* Cover image */}
          <Image
            src={
              bannerList[0]?.image ||
              "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80"
            }
            alt={bannerList[0]?.title || "Promo Banner"}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/10 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-80" />

          {/* Text */}
          <div className="z-20 absolute left-4 top-4 md:top-8 md:left-8 text-white">
            {bannerList[0]?.subTitle && (
              <p className="text-[9px] md:text-xs uppercase tracking-widest font-light opacity-90 truncate max-w-[90%] mb-1">
                {bannerList[0].subTitle}
              </p>
            )}
            {bannerList[0]?.title && (
              <h2 className="text-sm md:text-2xl xl:text-3xl font-bold leading-tight truncate max-w-[90%]">
                {bannerList[0].title}
              </h2>
            )}
          </div>

          {/* Discount badge */}
          {bannerList[0]?.discount && (
            <span className="absolute top-3 right-3 z-20 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
              {bannerList[0].discount}% OFF
            </span>
          )}

          {/* Arrow button */}
          {bannerList[0]?.buttonText && (
            <div className="absolute bottom-4 left-4 md:left-8 z-20 bg-white rounded-full p-2 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:bg-black">
              <ArrowUpRight className="w-4 h-4 md:w-6 md:h-6 text-black group-hover:text-white transition-colors duration-300" />
            </div>
          )}
        </Link>

        {/* Banner 1 — Right Top */}
        <Link
          href={getLink(bannerList[1])}
          style={{ animationDelay: "0.12s" }}
          className="col-span-5 h-full relative rounded-[20px] overflow-hidden group animate-slideUp"
        >
          <Image
            src={
              bannerList[1]?.image ||
              "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=700&q=80"
            }
            alt={bannerList[1]?.title || "Promo Banner"}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/10 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-80" />

          <div className="z-20 absolute top-3 left-3 md:top-5 md:left-5 text-white">
            {bannerList[1]?.title && (
              <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[9px] md:text-xs font-medium px-2 py-0.5 md:px-3 md:py-1 rounded-full mb-2">
                {bannerList[1].title}
              </span>
            )}
            {bannerList[1]?.subTitle && (
              <h2 className="text-sm md:text-2xl xl:text-2xl font-bold leading-tight truncate max-w-[90%]">
                {bannerList[1].subTitle}
              </h2>
            )}
          </div>

          {bannerList[1]?.discount && (
            <span className="absolute top-3 right-3 z-20 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
              {bannerList[1].discount}% OFF
            </span>
          )}

          {bannerList[1]?.buttonText && (
            <div className="absolute bottom-4 left-3 md:left-5 z-20 bg-white rounded-full p-2 shadow transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:bg-black">
              <ArrowUpRight className="w-4 h-4 md:w-6 md:h-6 text-black group-hover:text-white transition-colors duration-300" />
            </div>
          )}
        </Link>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 h-48 md:h-[410px] xl:h-[450px]">

        {/* Banner 2 — Left */}
        <Link
          href={getLink(bannerList[2])}
          style={{ animationDelay: "0.20s" }}
          className="h-full relative rounded-[20px] overflow-hidden group animate-slideUp"
        >
          <Image
            src={
              bannerList[2]?.image ||
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
            }
            alt={bannerList[2]?.title || "Banner"}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-10 transition-opacity duration-300 group-hover:opacity-90" />

          <div className="z-20 absolute top-3 left-3 md:top-5 md:left-5 text-white">
            {bannerList[2]?.subTitle && (
              <p className="text-[9px] md:text-xs uppercase tracking-widest font-light opacity-85 mb-1">
                {bannerList[2].subTitle}
              </p>
            )}
            {bannerList[2]?.title && (
              <h2 className="text-xs md:text-lg font-bold leading-tight">
                {bannerList[2].title}
              </h2>
            )}
          </div>

          {bannerList[2]?.discount && (
            <span className="absolute top-3 right-3 z-20 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
              {bannerList[2].discount}% OFF
            </span>
          )}

          {bannerList[2]?.buttonText && (
            <div className="absolute bottom-4 left-3 md:left-5 z-20 bg-white rounded-full p-2 shadow transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:bg-black">
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-black group-hover:text-white transition-colors duration-300" />
            </div>
          )}
        </Link>

        {/* Middle Column */}
        <div className="flex flex-col h-full gap-2 md:gap-4">

          {/* Banner 3 — Watch */}
          <Link
            href={getLink(bannerList[3])}
            style={{ animationDelay: "0.28s" }}
            className="h-1/2 relative rounded-[20px] overflow-hidden group animate-slideUp"
          >
            <Image
              src={
                bannerList[3]?.image ||
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
              }
              alt={bannerList[3]?.title || "Watch"}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 z-10 transition-opacity duration-300 group-hover:opacity-90" />

            <div className="z-20 absolute top-2 left-2 md:top-4 md:left-4 text-white">
              {bannerList[3]?.subTitle && (
                <p className="text-[8px] md:text-xs uppercase tracking-widest opacity-80 mb-0.5">
                  {bannerList[3].subTitle}
                </p>
              )}
              {bannerList[3]?.title && (
                <h2 className="text-[10px] md:text-base font-bold leading-tight">
                  {bannerList[3].title}
                </h2>
              )}
            </div>

            {bannerList[3]?.discount && (
              <span className="absolute top-2 right-2 z-20 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                {bannerList[3].discount}% OFF
              </span>
            )}

            {bannerList[3]?.buttonText && (
              <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/25 backdrop-blur-md border border-white/40 text-white px-3 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl flex items-center gap-1.5 text-[9px] md:text-xs font-medium whitespace-nowrap transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:-translate-x-1/2 group-hover:-translate-y-1">
                {bannerList[3].buttonText}
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </div>
            )}
          </Link>

          {/* Banner 4 — Shoes */}
          <Link
            href={getLink(bannerList[4])}
            style={{ animationDelay: "0.34s" }}
            className="h-1/2 relative rounded-[20px] overflow-hidden group animate-slideUp"
          >
            <Image
              src={
                bannerList[4]?.image ||
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
              }
              alt={bannerList[4]?.title || "Shoes"}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 z-10 transition-opacity duration-300 group-hover:opacity-90" />

            <div className="z-20 absolute top-2 left-2 md:top-4 md:left-4 text-white">
              {bannerList[4]?.subTitle && (
                <p className="text-[8px] md:text-xs uppercase tracking-widest opacity-80 mb-0.5">
                  {bannerList[4].subTitle}
                </p>
              )}
              {bannerList[4]?.title && (
                <h2 className="text-[10px] md:text-base font-bold leading-tight">
                  {bannerList[4].title}
                </h2>
              )}
            </div>

            {bannerList[4]?.discount && (
              <span className="absolute top-2 right-2 z-20 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                {bannerList[4].discount}% OFF
              </span>
            )}

            {bannerList[4]?.buttonText && (
              <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/25 backdrop-blur-md border border-white/40 text-white px-3 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl flex items-center gap-1.5 text-[9px] md:text-xs font-medium whitespace-nowrap transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:-translate-x-1/2 group-hover:-translate-y-1">
                {bannerList[4].buttonText}
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </div>
            )}
          </Link>
        </div>

        {/* Banner 5 — Right */}
        <Link
          href={getLink(bannerList[5])}
          style={{ animationDelay: "0.40s" }}
          className="h-full relative rounded-[20px] overflow-hidden group animate-slideUp"
        >
          <Image
            src={
              bannerList[5]?.image ||
              "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80"
            }
            alt={bannerList[5]?.title || "Woman"}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-10 transition-opacity duration-300 group-hover:opacity-90" />

          <div className="z-20 absolute top-3 left-3 md:top-5 md:left-5 text-white">
            {bannerList[5]?.subTitle && (
              <p className="text-[9px] md:text-xs uppercase tracking-widest font-light opacity-85 mb-1">
                {bannerList[5].subTitle}
              </p>
            )}
            {bannerList[5]?.title && (
              <h2 className="text-xs md:text-lg font-bold leading-tight">
                {bannerList[5].title}
              </h2>
            )}
          </div>

          {bannerList[5]?.discount && (
            <span className="absolute top-3 right-3 z-20 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
              {bannerList[5].discount}% OFF
            </span>
          )}

          {bannerList[5]?.buttonText && (
            <div className="absolute bottom-4 left-3 md:left-5 z-20 bg-white rounded-full p-2 shadow transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:bg-black">
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-black group-hover:text-white transition-colors duration-300" />
            </div>
          )}
        </Link>
      </div>
    </section>
  );
};

export default Promo;