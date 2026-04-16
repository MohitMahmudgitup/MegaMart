"use client";

import Sidebar from "./Sidebar";
import Promo from "./Promo";
import { useGetAllBannersQuery } from "@/redux/featured/Banner/bannerApi";
import { HeroSectionSkeleton } from "./HeroSectionSkeleton";
import { AlertTriangle, RefreshCcw, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const { data: banners, isLoading, error, refetch } =
    useGetAllBannersQuery();

  if (isLoading) return <HeroSectionSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-2xl border border-red-100">
        <div className="text-center space-y-4 px-4">
          <div className="flex justify-center">
            <div className="bg-red-100 p-4 rounded-full">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
          </div>

          <p className="text-red-600 font-semibold text-lg">
            Failed to load banners
          </p>

          <p className="text-sm text-red-500">
            Something went wrong. Please try again.
          </p>

          <Button
            onClick={() => refetch()}
            className="mt-2 flex items-center gap-2 mx-auto"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const bannerList = banners?.banners || [];

  // ✅ EMPTY STATE (no images)
  if (!bannerList || bannerList.length === 0) {
    return (
      <div className="flex items-center justify-center h-72 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-dashed border-gray-300">
        <div className="text-center space-y-4 px-6">
          <div className="flex justify-center">
            <div className="bg-gray-200 p-4 rounded-full">
              <ImageOff className="text-gray-500 w-8 h-8" />
            </div>
          </div>

          <div>
            <p className="text-gray-700 font-semibold text-lg">
              No banners available
            </p>
            <p className="text-sm text-gray-500 mt-1">
              We are currently updating content. Please check back later.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => refetch()}
            className="flex items-center gap-2 mx-auto"
          >
            <RefreshCcw className="w-4 h-4" />
            Reload
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* <Sidebar banners={banners} /> */}
      <div className="flex-1 px-2 md:px-0">
        <Promo banners={bannerList} />
      </div>
    </div>
  );
};

export default HeroSection;