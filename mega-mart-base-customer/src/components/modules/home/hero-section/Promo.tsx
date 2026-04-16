"use client";

import { ArrowUpRight, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  const getLink = (item?: Banner, fallback = "/category/all") => {
    return item?.buttonLink || fallback;
  };

  // ✅ EMPTY STATE
  if (!bannerList.length) {
    return (
      <section className="grid grid-cols-1 gap-4">
        <div className="h-[320px] md:h-[420px] w-full rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center text-center p-6">

          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <ImageOff className="text-gray-500 w-6 h-6" />
          </div>

          <h2 className="text-lg font-semibold text-gray-700">
            No promotions available
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            We are updating new offers. Please check back soon.
          </p>

          <Button
            onClick={() => window.location.reload()}
            className="mt-4 flex items-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-2 md:gap-4">

      {/* ───────── TOP ROW ───────── */}
      <div className="grid grid-cols-12 gap-2 md:gap-4 h-28 md:h-[196px] xl:h-60">

        {/* Banner 0 */}
        <Link href={getLink(bannerList[0])}
          className="col-span-7 relative rounded-[20px] overflow-hidden group animate-slideUp">

          {bannerList[0]?.image ? (
            <Image
              src={bannerList[0].image}
              alt={bannerList[0]?.title || "Banner"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <ImageOff className="w-6 h-6 text-gray-500" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/10 to-transparent z-10 group-hover:opacity-80" />

          <div className="z-20 absolute left-4 top-4 md:top-8 md:left-8 text-white">
            {bannerList[0]?.subTitle && (
              <p className="text-[9px] md:text-xs uppercase tracking-widest opacity-90 mb-1">
                {bannerList[0].subTitle}
              </p>
            )}
            {bannerList[0]?.title && (
              <h2 className="text-sm md:text-2xl xl:text-3xl font-bold leading-tight">
                {bannerList[0].title}
              </h2>
            )}
          </div>

          {bannerList[0]?.discount && (
            <span className="absolute top-3 right-3 z-20 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full">
              {bannerList[0].discount}% OFF
            </span>
          )}

          {bannerList[0]?.buttonText && (
            <div className="absolute bottom-4 left-4 md:left-8 z-20 bg-white rounded-full p-2 shadow group-hover:bg-black">
              <ArrowUpRight className="w-4 h-4 text-black group-hover:text-white" />
            </div>
          )}
        </Link>

        {/* Banner 1 */}
        <Link href={getLink(bannerList[1])}
          className="col-span-5 relative rounded-[20px] overflow-hidden group animate-slideUp">

          {bannerList[1]?.image ? (
            <Image
              src={bannerList[1].image}
              alt={bannerList[1]?.title || "Banner"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <ImageOff className="w-6 h-6 text-gray-500" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/10 to-transparent z-10" />

          <div className="z-20 absolute top-3 left-3 text-white">
            {bannerList[1]?.title && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {bannerList[1].title}
              </span>
            )}
            {bannerList[1]?.subTitle && (
              <h2 className="text-sm md:text-xl font-bold mt-2">
                {bannerList[1].subTitle}
              </h2>
            )}
          </div>
        </Link>
      </div>

      {/* ───────── BOTTOM ROW ───────── */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 h-48 md:h-[410px]">

        {/* Banner 2 */}
        <Link href={getLink(bannerList[2])}
          className="relative rounded-[20px] overflow-hidden group animate-slideUp">

          {bannerList[2]?.image ? (
            <Image
              src={bannerList[2].image}
              alt={bannerList[2]?.title || "Banner"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <ImageOff className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </Link>

        {/* Middle column */}
        <div className="flex flex-col gap-2 md:gap-4">

          {/* Banner 3 */}
          <Link href={getLink(bannerList[3])}
            className="h-1/2 relative rounded-[20px] overflow-hidden group">

            {bannerList[3]?.image ? (
              <Image
                src={bannerList[3].image}
                alt="Banner"
                fill
                className="object-cover group-hover:scale-110 transition-transform"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <ImageOff className="w-5 h-5 text-gray-500" />
              </div>
            )}
          </Link>

          {/* Banner 4 */}
          <Link href={getLink(bannerList[4])}
            className="h-1/2 relative rounded-[20px] overflow-hidden group">

            {bannerList[4]?.image ? (
              <Image
                src={bannerList[4].image}
                alt="Banner"
                fill
                className="object-cover group-hover:scale-110 transition-transform"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <ImageOff className="w-5 h-5 text-gray-500" />
              </div>
            )}
          </Link>
        </div>

        {/* Banner 5 */}
        <Link href={getLink(bannerList[5])}
          className="relative rounded-[20px] overflow-hidden group animate-slideUp">

          {bannerList[5]?.image ? (
            <Image
              src={bannerList[5].image}
              alt={bannerList[5]?.title || "Banner"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <ImageOff className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </Link>

      </div>
    </section>
  );
};

export default Promo;