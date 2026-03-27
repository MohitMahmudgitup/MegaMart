"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { IProduct } from "@/types/product";

interface BestSellingProps {
  data?: IProduct[];
}

export default function BestSelling({ data = [] }: BestSellingProps) {
  if (!data || data.length === 0) {
    return null;
  }

    const slugify = (text: string) => {
    return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
  }


  return (
    <section className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-white rounded-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Best Selling</h2>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {data.length > 0 ? (
          data.map((product) => (
            <Link
              key={product._id}
              href={`/product-details/${slugify(product.description?.name || "product")}-${product._id}`}
              className="w-full"
            >
              <Card className="rounded-2xl w-full lg:w-[220px]  border hover:shadow-sm transition-all duration-300 cursor-pointer">
                <CardContent className="flex flex-col ">
                  {/* Image */}
                  <div className="w-full  lg:h-40 md:h-32 h-28 relative ">
                    <Image
                      src={product.featuredImg || "/placeholder-product.jpg"}
                      alt={product.description?.name || "Product"}
                      fill
                      className="object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-product.jpg";
                      }}
                    />
                  </div>
                  <div className="flex flex-col flex-grow p-2">
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
                      <div className="flex flex-col">
                        <p className="text-lg md:text-2xl font-bold">
                          £{product.productInfo?.price || 0}.00
                        </p>
                      </div>

                      <Button
                        size="icon"
                        className="rounded-full w-8 h-8 md:w-9 md:h-9 bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-black" />
                      </Button>
                    </div>


                  </div>

                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Best Selling Products Found
              </h3>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
