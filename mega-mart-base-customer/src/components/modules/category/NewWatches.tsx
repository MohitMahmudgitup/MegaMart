/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";

type ProductData = {
  _id: string;
  featuredImg: string;
  description: {
    name: string;
    slug: string;
    unit: string;
    description: string;
    status: string;
  };
  productInfo: {
    price: number;
    salePrice: number;
    quantity: number;
    sku: string;
    status: string;
  };
  brandAndCategories: {
    brand: {
      _id: string;
      name: string;
      icon: any;
    };
    categories: Array<{
      _id: string;
      name: string;
      slug: string;
    }>;
    tags: any[];
  };
  productType: string;
  createdAt: string;
  updatedAt: string;
};

interface NewWatchesProps {
  data?: ProductData[];
}

export default function NewWatches({ data = [] }: NewWatchesProps) {
  console.log(data)
  if (!data || data.length === 0) {
    return null;
  }

  // Extract unique categories
  const categories = useMemo(() => {
    if (!data || data.length === 0) return ["All Products"];

    const categorySet = new Set<string>();
    data.forEach((product) => {
      if (product.brandAndCategories?.categories) {
        product.brandAndCategories.categories.forEach((cat) => {
          categorySet.add(cat.name);
        });
      }
    });

    return Array.from(categorySet);
  }, [data]);

  const [activeCategory, setActiveCategory] = useState("All");
  const allCategories = ["All", ...categories];

  // Filter products
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") {
      return data;
    }
    return data.filter((product) =>
      product.brandAndCategories?.categories?.some(
        (cat) => cat.name === activeCategory
      )
    );
  }, [data, activeCategory]);

  // Format price with Bangladeshi Taka symbol (large and bold)
  const formatPrice = (price: number, salePrice?: number) => {
    const currentPrice = salePrice && salePrice > 0 ? salePrice : price;
    return (
      <span className="flex items-baseline gap-1">
        <span className="text-2xl md:text-xl font-extrabold ">৳</span>
        <span className="text-lg md:text-xl font-bold text-black">
          {currentPrice.toFixed(2)}
        </span>
      </span>
    );
  };

  return (
    <section className="w-full py-6 px-4 md:px-6 lg:px-8 bg-white rounded-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">New Arrival</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2  gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card
              key={product._id}
              className="rounded-2xl w-full lg:w-[220px]  border-none shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
            >
              <Link href={`/product-details/${product._id}`}>
                <CardContent className="flex flex-col justify-between h-full ">
                  {/* Image */}
                  <div className="w-full h-[150px] relative flex items-center justify-center ">
                    <Image
                      src={product.featuredImg || "/placeholder-watch.jpg"}
                      alt={product.description?.name || "Product"}
                      fill
                      className="object-cover rounded-lg bg-white"
                      unoptimized
                    />
                  </div>


<div className="flex flex-col flex-grow p-4 ">
   {/* Info */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-sm md:text-base line-clamp-1">
                      {product.description?.name || "Unnamed Product"}
                    </h3>
                    <p
                      className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          product.description?.description ||
                          "No description available",
                      }}
                    ></p>
                  </div>

                  {/* Price + Arrow */}
                  <div className="flex items-center justify-between mt-4">
                    <p>
                      {formatPrice(
                        product.productInfo?.price || 0,
                        product.productInfo?.salePrice
                      )}
                    </p>
                    <Button
                      size="icon"
                      className="rounded-full w-8 h-8 md:w-9 md:h-9 bg-gray-200 hover:bg-gray-300 transition-colors"
                      disabled={product.productInfo?.status !== "publish"}
                    >
                      <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-black" />
                    </Button>
                  </div>


</div>
                 
                </CardContent>
              </Link>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      {/* <div className="flex justify-center mt-10">
        <Button
          variant="outline"
          className="rounded-[12px] border border-gray-300 px-6 py-3 text-sm md:text-base font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          Go To Collection
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div> */}
    </section>
  );
}
