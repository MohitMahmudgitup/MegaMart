"use client";
import React from "react";
import SectionHeader from "../new-arrivals/SectionHeader";
import BestSellerCard from "@/components/cards/BestSellerCard";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useGetBestSellingProductsQuery } from "@/redux/featured/product/productApi";
import { IProduct } from "@/types/product";
import Link from "next/link";
import { BestSellerSkeleton } from "./BestSellerSkeleton";


const BestSeller = () => {
  const { data, isLoading } = useGetBestSellingProductsQuery({});
 

  // Filter products that have "Best Selling" tag
  const bestSellerProducts = data

  if (isLoading) {
    return <BestSellerSkeleton />;
  }

  // if (bestSellerProducts?.length === 0) {
  //   return (
  //     < >
  //       <div className="flex  justify-center items-center">
  //         <SectionHeader title="Best Selling Store" />
  //       </div>
  //       <div className="flex justify-center items-center py-20">
  //         <div className="text-lg text-gray-500">No best seller products found</div>
  //       </div>
  //     </>
  //   );
  // }

  

  return (
    
    <>
    {
      data && data.length > 0 && (
        <>
             <div className="flex justify-center pt-6 items-center">
        <SectionHeader title="Best Selling Store" />
      </div>
      <section className="mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {bestSellerProducts?.map((product: IProduct) => (
            <BestSellerCard
              id={product._id}
              key={product._id}
              title={product.description.name}
              subtitle={product.description.description}
              image={product.featuredImg}
            />
          ))}
        </div>
      </section>
      {/* <div className="flex justify-center mt-10">
        <Link href={'/product-collection'}>
          <Button
            className="py-5 !px-5 rounded-[12px] text-base"
            variant={"outline"}
          >
            Go To Collection <ChevronRight />
          </Button>
        </Link>
      </div> */}
        
        
        </>
      )
    }
 
    </>
  );
};

export default BestSeller;