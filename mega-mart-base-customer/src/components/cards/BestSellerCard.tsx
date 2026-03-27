import Image from "next/image";
import NextLink from "next/link";
import React from "react";
import { ArrowUpRight } from "lucide-react";

type BestSellerCardProps = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
};

const BestSellerCard = ({ id, title, subtitle, image }: BestSellerCardProps) => {
  const slugify = (text: string) => {
    return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
  }
  const slug = `${slugify(title)}-${id}`;
  return (
    <div
      className="group relative rounded-3xl overflow-hidden 
      bg-gradient-to-br from-[#fafafa] to-[#eaeaea]
      shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
       <NextLink
        href={`/product-details/${slug}`}>


      <div className="relative w-full h-[240px] md:h-[260px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
        </NextLink>

      {/* Bottom Text Glass Effect */}
      <div
        className="absolute bottom-3 left-3 right-3 
        bg-white/40 backdrop-blur-md 
        rounded-xl p-3 text-center shadow-md border border-white/30"
      >
        <h2 className="text-[10px] md:text-[12px] font-semibold text-gray-900 line-clamp-2 leading-tight">
          {title}
        </h2>

        {/* {subtitle && (
          <p
            className="text-[8px] md:text-[10px] mt-1 text-gray-700"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )} */}
      </div>

      {/* Button */}
      <NextLink
        href={`/product-details/${slug}`}
        className="absolute top-3 right-3 bg-white/80 backdrop-blur-md 
        hover:bg-white text-black p-2 rounded-xl shadow-md
        transition-all duration-300 border border-white/40"
      >
        <ArrowUpRight className="w-5 h-5" />
      </NextLink>
    </div>
  );
};

export default BestSellerCard;
