"use client";


import Sidebar from "./Sidebar";
import Promo from "./Promo";
import { useGetAllBannersQuery } from "@/redux/featured/Banner/bannerApi";
import { HeroSectionSkeleton } from "./HeroSectionSkeleton";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const { data: banners, isLoading, error } = useGetAllBannersQuery();

 if (isLoading) return <HeroSectionSkeleton />;
  
  if (error) {
    return (
<div className="flex items-center justify-center h-64 bg-red-50 rounded-2xl border border-red-100">
  <div className="text-center space-y-4 px-4">
    
    {/* Icon */}
    <div className="flex justify-center">
      <div className="bg-red-100 p-4 rounded-full">
        <AlertTriangle className="text-red-500 w-8 h-8" />
      </div>
    </div>

    {/* Title */}
    <p className="text-red-600 font-semibold text-lg">
      Failed to load banners
    </p>

    {/* Description */}
    <p className="text-sm text-red-500">
      Something went wrong. Please try refreshing the page.
    </p>

    {/* Button */}
    <Button
      onClick={() => window.location.reload()}
      className="mt-2 flex items-center gap-2 mx-auto"
    >
      <RefreshCcw className="w-4 h-4" />
      Refresh Page
    </Button>
  </div>
</div>

    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      <Sidebar banners={banners} />
      <div className="flex-1 px-2 md:px-0">
        <Promo banners={banners.banners} />
      </div>
    </div>
  );
};

export default HeroSection;
