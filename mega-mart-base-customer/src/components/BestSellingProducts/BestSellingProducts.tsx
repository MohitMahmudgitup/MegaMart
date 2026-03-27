"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Key } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";
import { BestSellingProductsSkeleton } from "./BestSellingProductsSkeleton";

export default function BestSellingProducts() {
  const [isVisible, setIsVisible] = useState(false);

  // RTK Query থেকে প্রোডাক্ট ডেটা ফেচ
  const { data: products, error, isLoading } = useGetAllProductsQuery({});

  // Console log করতে useEffect ব্যবহার
  useEffect(() => {
    if (isLoading) {
    } else if (error) {
    } else if (products) {
    }
  }, [products, error, isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <BestSellingProductsSkeleton />;
  }

  if (error) {
    return (
      <p className="text-center py-12 text-red-500">Error loading products.</p>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 bg-white py-10 sm:py-6 rounded-lg">
      {/* Header */}
      <div
        className={`flex items-center justify-between mb-8 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
      >
        <h2 className="md:text-3xl text-xl font-bold text-gray-900">
          Best Selling Products
        </h2>
        <Button
          variant="outline"
          className="group bg-black border-gray-300 text-white hover:bg-gray-50 px-6 py-2 rounded-lg  hover:shadow-md transition-all duration-300 hover:border-gray-400"
        >
          Go To Collection
          <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products?.map(
          (
            product: {
              _id: Key | null | undefined;
              featuredImg: any;
              description: { name: any; subtitle: any };
              productInfo: { price: number };
            },
            index: number
          ) => (
            <Link
              key={product._id}
              href={`/product-details/${product._id}`}
              className={`bg-[#F5F6F6] rounded-lg  group   cursor-pointer ${isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              {/* Product Image */}
              <div className="aspect-square w-full h-[200px] mb-3 sm:mb-4 flex items-center justify-center overflow-hidden rounded-t-lg relative">
                <Image
                  src={product.featuredImg || "/placeholder.svg"}
                  alt={product.description?.name || "Product"}
                  fill
                  loading="lazy"
                  className="object-cover  "
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-product.jpg";
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 p-4 sm:space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm  line-clamp-2 leading-tight sm:text-base transition-colors duration-300 group-hover:text-gray-700">
                  {product.description?.name || "Unnamed Product"}
                </h3>
                <p className="text-gray-600 text-xs  line-clamp-2 leading-tight  sm:text-sm transition-colors duration-300 group-hover:text-gray-500">
                  {product.description?.subtitle || ""}
                </p>

                {/* Price */}
               <div className="flex items-center justify-between pt-1.5 sm:pt-2">
  {/* Price */}
  <span className="
    font-semibold 
    text-lg sm:text-xl 
    text-gray-900 
    transition-all duration-300 
    group-hover:text-gray-800 
  ">
    BDT {product.productInfo?.price?.toFixed(2) || "0.00"}
  </span>

  {/* Button */}
  <div
    className="
      w-10 h-10
      bg-white 
      rounded-full 
      flex items-center justify-center 
      shadow-md
      transition-all duration-300
      group-hover:shadow-lg
      hover:scale-105
    "
  >
    <ArrowUpRight
      className="
        h-6 w-6 
        text-gray-700
        transition-all duration-300
        group-hover:text-gray-900
        group-hover:rotate-45
      "
    />
  </div>
</div>

              </div>
            </Link>
          )
        )}
      </div>
    </section>
  );
}
