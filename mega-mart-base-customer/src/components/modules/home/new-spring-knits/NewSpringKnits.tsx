"use client";
import React from "react";
import SectionHeader from "../new-arrivals/SectionHeader";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNewArrivalsListDataQuery } from "@/redux/featured/product/productApi";
import Link from "next/link";
import { NewSpringKnitsSkeleton } from "./NewSpringKnitsSkeleton";

const NewSpringKnits = () => {
  const { data, isLoading } = useNewArrivalsListDataQuery();
  const springKnitsProducts = data?.slice(0, 4) || [];

  if (isLoading) return <NewSpringKnitsSkeleton />;

  return (
    <div className="bg-white md:rounded-lg p-4 sm:p-6">
      <SectionHeader title="New Spring Knits" />

      <section className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {springKnitsProducts.map((product: any) => (
            <div
              key={product._id}
              className="group flex flex-col gap-2 relative rounded-2xl overflow-hidden ransition-all  "
            >
              {/* Image */}
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={product.featuredImg || "/placeholder-image.jpg"}
                  alt={product.description?.name || "Product"}
                  fill
                  className="object-cover border rounded-2xl  "
                />

                {/* Gradient hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t rounded-2xl from-black/40 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Desktop CTA */}
                <div className="absolute inset-0 hidden md:flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href="/product-collection">
                    <Button
                      variant="secondary"
                      className="rounded-full px-5 py-2 text-sm shadow"
                    >
                      View Collection <ChevronRight size={16} />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Badge */}
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] px-3 py-1 rounded-full font-semibold shadow">
                New Spring
              </span>

              {/* Product info */}
              <div className="p-3 border rounded-2xl ">
                <h3 className="text-sm font-medium truncate">
                  {product.description?.name}
                </h3>

                <div className="flex items-center gap-2 mt-1 ">
                  {product.productInfo?.salePrice && (
                    <span className="text-lg font-semibold text-red-600">
                      ৳{product.productInfo.salePrice}
                    </span>
                  )}
                  {product.productInfo?.price && (
                    <span
                      className={`text-xs ${
                        product.productInfo.salePrice
                          ? "line-through text-gray-400"
                          : "font-semibold"
                      }`}
                    >
                      ৳{product.productInfo.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile CTA */}
      <div className="flex md:hidden  justify-center mt-8">
        <Link href="/product-collection" className="w-full">
          <Button
            variant="outline"
            className="w-full bg-black text-white rounded-xl py-6 text-base font-semibold"
          >
            Go To Collection <ChevronRight />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NewSpringKnits;
