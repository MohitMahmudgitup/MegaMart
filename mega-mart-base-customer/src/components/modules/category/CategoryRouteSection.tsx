"use client";

import { Badge } from "@/components/ui/badge";
import {
  useGetAllProductsbyCategoryNameQuery,
  useGetBestSellingProductsQuery,
} from "@/redux/featured/product/productApi";
import { useGetAllCategoryQuery } from "@/redux/featured/category/categoryApi";
import Image from "next/image";
import BestSelling from "./BestSelling";
import NewWatches from "./NewWatches";
import Discount from "./Discount";
import SaveMoreSection from "./SaveMoreSection";
import AppPromo from "./AppPromo";
import { skipToken } from "@reduxjs/toolkit/query";
import type { Metadata } from "next";
import { BestSellingSkeleton } from "./BestSellingSkeleton";
import { NewWatchesSkeleton } from "./NewWatchesSkeleton";
import { DiscountSkeleton } from "./DiscountSkeleton";
import { useMemo } from "react";

export const metadata: Metadata = {
  title: "Category",
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  details?: string;
  bannerImg?: string;
  isFeatured?: boolean;
  [key: string]: any;
}

export default function CategoryRouteSection({ slug }: { slug: string }) {
  const { data: products, isLoading: productsLoading } = useGetAllProductsbyCategoryNameQuery(
    slug ? { slug } : skipToken
  );

  const { data: bestSellingProducts, isLoading: bestSellingLoading } = useGetBestSellingProductsQuery(
    slug === "all" ? {} : { category: slug }
  );

  const { data: categories, isLoading: categoriesLoading } = useGetAllCategoryQuery();

  const decodedSlug = decodeURIComponent(slug as string);

  const filteredCategories: Category[] | undefined = categories?.filter(
    (cat: Category) => cat.slug === decodedSlug
  );

  // Check if discount products exist
  const discountProducts = useMemo(() => {
    return products?.filter((product: any) =>
      product.brandAndCategories?.tags?.some((tag: any) =>
        tag.name === "10% Discount"
      )
    ) || [];
  }, [products]);
  

  return (
    <>
      <div className="space-y-16">
        {slug === "all" ? (
          ""
        ) : categoriesLoading ? (
          <section className="w-full bg-gray-50 md:rounded-lg overflow-hidden p-6 md:p-12 animate-pulse">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
              <div className="flex-1 max-w-lg space-y-4">
                <div className="h-8 bg-gray-200 rounded-full w-32"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="relative w-full md:w-1/2 lg:w-[55%] aspect-[4/3] bg-gray-200 rounded-xl"></div>
            </div>
          </section>
        ) : filteredCategories?.length ? (
          filteredCategories.map((category: Category) => (
<section
  key={category._id}
  className="
    w-full md:rounded-lg overflow-hidden
    p-6 md:p-12
    flex flex-col md:flex-row items-center justify-between
    gap-8 md:gap-12
    bg-gradient-to-br from-indigo-200 via-white to-violet-200
    transition-all duration-500
  "
>
  {/* Left Content */}
  <div className="flex-1 max-w-lg space-y-5">
    <Badge
      className="
        px-4 py-1.5 rounded-full
        bg-gradient-to-r from-indigo-600 to-violet-600
        text-white text-xs font-semibold
        w-fit shadow-md
      "
    >
      ● New Arrival
    </Badge>

    <h2 className="text-lg sm:text-3xl md:text-4xl font-bold leading-snug text-gray-900">
      {category.name}
    </h2>

    <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
      {category.details}
    </p>
  </div>

  {/* Image */}
  <div
    className="
      relative w-full md:w-1/2 lg:w-[55%]
      aspect-[4/3]
      rounded-2xl overflow-hidden
      mt-8 md:mt-0
      group
    "
  >
    <Image
      src={category.bannerImg || "/watches.png"}
      alt={category.name}
      fill
      priority
      className="
        object-cover object-center
      "
    />

    {/* Subtle overlay */}
    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" /> */}
  </div>
</section>



          ))
        ) : null}

        {/* Best Selling Section - Only show if has data or loading */}
        {bestSellingLoading ? (
          <BestSellingSkeleton />
        ) : bestSellingProducts && bestSellingProducts.length > 0 ? (
          <BestSelling data={bestSellingProducts} />
        ) : null}

        {/* New Watches Section - Only show if has data or loading */}
        {productsLoading ? (
          <NewWatchesSkeleton />
        ) : products && products.length > 0 ? (
          <NewWatches data={products} />
        ) : null}

        {/* Discount Section - Only show if has discount products or loading */}
        {productsLoading ? (
          <DiscountSkeleton />
        ) : discountProducts.length > 0 ? (
          <Discount data={products || []} />
        ) : null}

        <SaveMoreSection />
        <AppPromo />
      </div>
    </>
  );
}
