"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Promo from "./Promo";
import { useGetAllBannersQuery } from "@/redux/featured/Banner/bannerApi";
import { HeroSectionSkeleton } from "./HeroSectionSkeleton";



const HeroSection = () => {
  const { data: banners, isLoading, error } = useGetAllBannersQuery();

 if (isLoading) return <HeroSectionSkeleton />;
  
  if (error) {
    return (
      <div className="flex items-center  justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load banners</p>
          <p className="text-sm text-red-500 mt-1">Please try refreshing the page</p>
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
