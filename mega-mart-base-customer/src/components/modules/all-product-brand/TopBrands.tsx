"use client";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import SectionHeader from "../home/new-arrivals/SectionHeader";
import { useAppSelector } from "@/redux/hooks";
import { selectBrands } from "@/redux/featured/brand/brandSlice";
import { TopBrandsSkeleton } from "./TopBrandsSkeleton";

const TopBrands = () => {
  const brands = useAppSelector(selectBrands);

  if (!brands.length)
    return <TopBrandsSkeleton />;

  // Map brands to only include name and icon URL
  const brad = brands.map((bran) => ({
    name: bran.name,
    url: bran.icon?.url || "/placeholder.png",
  }));

  const extendedBrands = [...brad, ...brad];

  return (
    <>
    <div className="pl-4">
      <SectionHeader title="Top Brand’s" />


    </div>

      <div className="w-full h-14 md:h-44 overflow-hidden">
        <Marquee speed={50} gradient={false} pauseOnHover={true} loop={0}>
          {extendedBrands.map((brand, index) => (
            <div
              key={index}
              className="relative w-14 md:w-44 h-14 md:h-44 md:px-6 flex items-center justify-center mx-3"
            >
              <Image
                src={brand.url}
                alt={brand.name}
                fill
                className="object-scale-down"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </>
  );
};

export default TopBrands;
