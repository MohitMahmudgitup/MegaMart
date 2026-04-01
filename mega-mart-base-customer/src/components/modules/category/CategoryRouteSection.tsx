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
import { useMemo } from "react";
import { BestSellingSkeleton } from "./BestSellingSkeleton";
import { NewWatchesSkeleton } from "./NewWatchesSkeleton";
import { DiscountSkeleton } from "./DiscountSkeleton";

export default function CategoryRouteSection({ slug }: { slug: string }) {
  const decodedSlug = decodeURIComponent(slug);

  const { data: categories, isLoading: categoriesLoading } =
    useGetAllCategoryQuery();

  // ✅ FIND CATEGORY OR SUBCATEGORY + PARENT SLUG
  const { matchedCategory, parentSlug } = useMemo(() => {
    if (!categories) return { matchedCategory: null, parentSlug: slug };

    for (const cat of categories) {
      // যদি main category match করে
      if (cat.slug === decodedSlug) {
        return {
          matchedCategory: cat,
          parentSlug: cat.slug,
        };
      }

      // যদি subcategory match করে
      const sub = cat.subCategories?.find(
        (s: any) => s.slug === decodedSlug
      );

      if (sub) {
        return {
          matchedCategory: sub,
          parentSlug: cat.slug, // 🔥 parent দিয়ে fetch হবে
        };
      }
    }

    return { matchedCategory: null, parentSlug: slug };
  }, [categories, decodedSlug, slug]);

  // ✅ FETCH PRODUCTS (always by parent)
  const { data: products, isLoading: productsLoading } =
    useGetAllProductsbyCategoryNameQuery(
      parentSlug ? { slug: parentSlug } : skipToken
    );

  const { data: bestSellingProducts, isLoading: bestSellingLoading } =
    useGetBestSellingProductsQuery(
      parentSlug === "all" ? {} : { category: parentSlug }
    );

  // ✅ FILTER PRODUCTS (category + subcategory)
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product: any) => {
      const categories = product.brandAndCategories?.categories || [];

      return categories.some((cat: any) => {
        // main category match
        if (cat.slug === decodedSlug) return true;

        // subcategory match
        return cat.subCategories?.some(
          (sub: any) => sub.slug === decodedSlug
        );
      });
    });
  }, [products, decodedSlug]);

  // ✅ DISCOUNT FILTER
  const discountProducts = useMemo(() => {
    return filteredProducts.filter((product: any) =>
      product.brandAndCategories?.tags?.some(
        (tag: any) => tag.name === "10% Discount"
      )
    );
  }, [filteredProducts]);

  return (
    <div className="space-y-16">
      {/* 🔥 CATEGORY / SUBCATEGORY BANNER */}
      {slug !== "all" &&
        (categoriesLoading ? (
          <div className="p-10 animate-pulse bg-gray-100 rounded-lg" />
        ) : matchedCategory ? (
       <section className="relative w-full h-screen rounded-2xl overflow-hidden px-4 md:px-6 lg:px-8">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src={matchedCategory.bannerImg || "/watches.png"}
      alt={matchedCategory.name}
      fill
      className="object-cover w-full h-full  "
      priority
    />
    {/* Dark overlay for text readability */}
    <div className="absolute inset-0 bg-black/30"></div>
  </div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-6xl mx-auto px-6 md:px-12 space-y-6 text-white">
    <Badge className="bg-indigo-500 text-white px-4 py-1 text-sm font-semibold rounded-full">
      ● New Arrival
    </Badge>

    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
      {matchedCategory.name}
    </h1>

    <p className="text-base sm:text-lg md:text-xl max-w-xl">
      {matchedCategory.details}
    </p>

    <button className="mt-4 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg font-semibold text-white text-lg">
      Explore
    </button>
  </div>
</section>
        ) : null)}

      {/* ✅ BEST SELLING */}
      {/* {bestSellingLoading ? (
        <BestSellingSkeleton />
      ) : bestSellingProducts?.length > 0 ? (
        <BestSelling data={bestSellingProducts} />
      ) : null} */}

      {/* ✅ PRODUCTS */}
      {productsLoading ? (
        <NewWatchesSkeleton />
      ) : filteredProducts.length > 0 ? (
        <NewWatches data={filteredProducts} />
      ) : (
        <p className="text-center text-gray-500">
          No products found
        </p>
      )}

      {/* ✅ DISCOUNT */}
      {productsLoading ? (
        <DiscountSkeleton />
      ) : discountProducts.length > 0 ? (
        <Discount data={discountProducts} />
      ) : null}

      <SaveMoreSection />
      <AppPromo />
    </div>
  );
}