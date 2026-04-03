"use client";

import {
  useGetAllProductsbyCategoryNameQuery,
} from "@/redux/featured/product/productApi";
import { useGetProductInCategoryQuery } from "@/redux/featured/category/categoryApi";
import Image from "next/image";
import NewWatches from "./NewWatches";
import Discount from "./Discount";
import SaveMoreSection from "./SaveMoreSection";
import AppPromo from "./AppPromo";
import { useMemo } from "react";
import { NewWatchesSkeleton } from "./NewWatchesSkeleton";
import { DiscountSkeleton } from "./DiscountSkeleton";

interface CategoryRouteSectionProps {
  id: string;
}

export default function CategoryRouteSection({ id }: CategoryRouteSectionProps) {
  // ✅ GET CATEGORY DATA (for banner)
  const { data: categories, isLoading: categoriesLoading } = useGetProductInCategoryQuery();
  console.log(categories , "categories in category route section");

  // Find matched category or subcategory
  const matchedCategory = useMemo(() => {
    if (!categories) return null;

    for (const cat of categories) {
      if (cat._id === id) return cat;

      const sub = cat.subCategories?.find((s: any) => s._id === id);
      if (sub) return sub;
    }

    return null;
  }, [categories, id]);

  // ✅ FETCH PRODUCTS BY CATEGORY ID
 const { data: products = [], isLoading: productsLoading } =
  useGetAllProductsbyCategoryNameQuery(
    { id: id },
  );
  


  // ✅ FILTER DISCOUNT PRODUCTS
  const discountProducts = useMemo(() => {
    return products.filter((product: any) =>
      product.brandAndCategories?.tags?.some(
        (tag: any) => tag.name === "10% Discount"
      )
    );
  }, [products]);

  return (
    <div className="space-y-16">
      {/* 🔥 BANNER */}
      {id !== "all" &&
        (categoriesLoading ? (
          <div className="p-10 animate-pulse bg-gray-100 rounded-lg" />
        ) : matchedCategory ? (
          <section className="relative w-full h-80 rounded-2xl overflow-hidden px-4 md:px-6 lg:px-8">
            <div className="absolute inset-0">
              <Image
                src={matchedCategory.bannerImg || "/watches.png"}
                alt={matchedCategory.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            <div className="relative z-10 flex flex-col justify-center h-full max-w-6xl mx-auto px-6 text-white">
              <h1 className="text-4xl md:text-6xl font-bold">{matchedCategory.name}</h1>
              <p className="mt-2 max-w-xl">{matchedCategory.details}</p>
            </div>
          </section>
        ) : (
          <p className="text-center text-gray-500">Category not found</p>
        ))}

      {/* ✅ PRODUCTS */}
      {productsLoading ? (
        <NewWatchesSkeleton />
      ) : products.length > 0 ? (
        <NewWatches data={products} />
      ) : (
        <p className="text-center text-gray-500">No products found</p>
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