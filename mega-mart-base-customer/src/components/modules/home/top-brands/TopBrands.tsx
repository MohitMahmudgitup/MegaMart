"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import SectionHeader from "../new-arrivals/SectionHeader";
import { useGetsliderImageQuery } from "@/redux/featured/brand/brandApi";
import { TopBrandsSkeleton } from "./TopBrandsSkeleton";
import Link from "next/link";

const TopBrands = () => {
  const { data, isLoading } = useGetsliderImageQuery();
  console.log(data);

  if (isLoading) {
    return <TopBrandsSkeleton />;
  }

  return (
    <section className="w-full  sm:py-6">
      {/* Header */}
      <div className="px-4 sm:px-6 mb-3">
        <SectionHeader title="Top Brands" />
      </div>

      {/* Marquee */}
      <div className="w-full overflow-hidden">
        <Marquee
          speed={40}
          gradient={false}
          pauseOnHover
          pauseOnClick
        >
          {data?.data?.map((brand: any, index: number) => (
            <Link key={index} href={`/all-product-brand/${brand._id}`} >
              <div
                className="relative flex items-center justify-center mx-2 sm:mx-4 w-24 h-24 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 md:rounded-lg bg-white transition-all duration-300"  >
                <Image
                  src={brand?.images?.[0]?.image || "/placeholder.jpg"}
                  alt={brand?.name || "Brand"}
                  fill
                  sizes="(max-width: 640px) 56px, (max-width: 768px) 80px, (max-width: 1024px) 112px, 144px"
                  className="object-contain p-2"
                />
              </div>


            </Link>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default TopBrands;
