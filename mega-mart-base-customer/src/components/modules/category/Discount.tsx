"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronRight } from "lucide-react";

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
    tags: Array<{
      _id: string;
      name: string;
      slug?: string;
    }>;
  };
  productType: string;
  createdAt: string;
  updatedAt: string;
};

interface DiscountProps {
  data?: ProductData[];
}

export default function Discount({ data = [] }: DiscountProps) {
  const discountProducts = useMemo(() => {
    return data.filter(product =>
      product.brandAndCategories?.tags?.some(tag =>
        tag.name === "10% Discount"
      )
    );
  }, [data]);

  if (!discountProducts || discountProducts.length === 0) {
    return null;
  }

  // Extract unique categories from the discount products
  const categories = useMemo(() => {
    if (!discountProducts || discountProducts.length === 0) return [];

    const categorySet = new Set<string>();
    discountProducts.forEach(product => {
      if (product.brandAndCategories?.categories) {
        product.brandAndCategories.categories.forEach(cat => {
          categorySet.add(cat.name);
        });
      }
    });

    return Array.from(categorySet);
  }, [discountProducts]);

  const [activeCategory, setActiveCategory] = useState("All");

  // Add "All" option to show all discount products
  const allCategories = ["All", ...categories];

  // Filter products based on active category (from discount products only)
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") {
      return discountProducts;
    }
    return discountProducts.filter(product =>
      product.brandAndCategories?.categories?.some(cat => cat.name === activeCategory)
    );
  }, [discountProducts, activeCategory]);


  return (
    <section className="w-full py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Up to 10% Discount</h2>
        </div>
        {allCategories.length > 1 && (
          <div className="flex flex-wrap gap-2 md:gap-3">
            {allCategories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className={`rounded-full px-4 md:px-5 text-xs md:text-sm ${activeCategory === cat
                  ? "bg-black text-white hover:bg-black"
                  : "bg-transparent border text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 px-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card
              key={product._id}
              className="rounded-2xl w-full lg:w-[220px] bg-[#F7F7F7] border-none shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative"
            >
              <CardContent className="flex flex-col p-4">
                {/* Image */}
                <div className="w-full lg:h-40 md:h-32 h-28 relative flex items-center justify-center mb-4">
                  <Image
                    src={product.featuredImg || "/placeholder-product.jpg"}
                    alt={product.description?.name || "Product"}
                    fill
                    className="object-contain rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-product.jpg";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-grow">
                  <h3 className="font-semibold text-sm md:text-base line-clamp-1">
                    {product.description?.name || "Unnamed Product"}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2">
                    {product.description?.description || "No description available"}
                  </p>
                </div>

                {/* Price + Arrow */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-col">
                    {/* Show sale price as main price if available */}
                    <p className="text-lg md:text-xl font-bold text-black flex items-baseline gap-1">
                      <span className="text-2xl md:text-3xl font-extrabold text-[#FF5724]">৳</span>
                      <span>
                        {product.productInfo?.salePrice
                          ? product.productInfo?.salePrice
                          : product.productInfo?.price || 0}.00
                      </span>
                    </p>
                  </div>

                  <Button
                    size="icon"
                    className="rounded-full w-8 h-8 md:w-9 md:h-9 bg-gray-200 hover:bg-gray-300 transition-colors"
                    disabled={product.productInfo?.status !== "publish"}
                  >
                    <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-black" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Discount Products Found
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button - Only show if there are products */}
      {filteredProducts.length > 0 && (
        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            className="rounded-[12px] border border-gray-300 px-6 py-3 text-sm md:text-base font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            View All Discounted Items
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </section>
  );
}