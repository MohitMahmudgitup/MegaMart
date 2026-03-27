"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectAllProducts } from "@/redux/featured/product/productSlice";
import Link from "next/link";
import { AdidasCollectionSkeleton } from "./AdidasCollectionSkeleton";

export default function AdidasCollection({ productsData }: any) {
  // Get products from Redux
  const products = productsData || useAppSelector(selectAllProducts);

  if (!products.length)
    return <AdidasCollectionSkeleton />;

  return (
    <section className="w-full py-6 bg-white rounded-lg px-4 ">
      {/* Header */}
      <div className="flex md:items-center justify-between mb-8 gap-4">
        <h2 className="md:text-3xl text-xl font-bold">Adidas Collection</h2>
        <Button
          variant="outline"
          className="rounded-[12px] border border-gray-300 px-6 py-3 text-sm md:text-base font-medium flex items-center gap-2 hover:bg-gray-100 transition"
        >
          Go To Collection
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Products Grid */}
      <div className=" grid sm:columns-2 md:columns-0  grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {products.map((product: any) => {
          const description = product.description?.description || "No Description";
          const shortDescription =
            description.length > 50 ? description.slice(0, 50) + "..." : description;

          return (
            <Link key={product._id} href={`/all-product-brand/${product._id}`}>
              <Card className="rounded-lg w-full lg:w-[220px] border hover:shadow-sm  transition flex flex-col">
                <CardContent className="flex flex-col justify-between h-full">
                  {/* Image */}
                  <div className="w-full h-[150px] relative flex items-center justify-center ">
                    <Image
                      src={product.featuredImg || "/placeholder.png"}
                      alt={product.description?.name || "Product Image"}
                      fill
                      className="object-cover rounded-lg bg-[#eeeeee]"
                    />
                  </div>

                  <div className="p-2 md:p-4">

                  {/* Info */}
                  <div>
                    <h3 className="font-semibold text-sm md:text-base line-clamp-1">
                      {product.description?.name || "No Name"}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
                      {shortDescription}
                    </p>
                  </div>

                  {/* Price + Arrow */}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-lg md:text-xl font-bold flex items-baseline gap-1">
                      <span className="text-2xl md:text-[16px] font-extrabold ">৳</span>
                      <span>{product.productInfo?.price || "0.00"}</span>
                    </p>
                    <Button
                      size="icon"
                      className="rounded-full w-9 h-9 bg-gray-200 hover:bg-gray-300"
                    >
                      <ArrowUpRight className="w-4 h-4 text-black" />
                    </Button>
                  </div>

                  </div>


                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
