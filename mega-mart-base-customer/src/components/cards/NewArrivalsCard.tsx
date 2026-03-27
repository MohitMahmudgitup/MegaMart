import Image from "next/image";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  image: string;
};

const NewArrivalsCard = ({
  id,
  title,
  subtitle,
  price,
  image,
}: ProductCardProps) => {
   const slugify = (text: string) => {
    return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
  }
  const slug = `${slugify(title)}-${id}`;

  return (
    <Card className="group overflow-hidden  border  gap-0 py-0 shadow-none">
   <Link href={`/product-details/${slug}`}>
        <div className="relative w-full h-[150px] sm:h-[235px] lg:h-[200px]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-top
          "
          />
        </div>
      
      </Link>

        <CardContent className="p-3">
          <div className="font-medium line-clamp-1 text-sm md:text-base">
            {title}
          </div>
          {subtitle && (
            <div
              className="text-[8px] md:text-xs text-muted-foreground line-clamp-1"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            ></div>
          )}
          <div className="flex justify-between items-center md:mt-4">
            <div className="mt-1 md:text-xl font-semibold flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary">৳</span>
              <span>{price.toFixed(2)}</span>
            </div>
            {/* btn */}

      <Link href={`/product-details/${slug}`} >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center
            group-hover:bg-primary/20 transition-colors">
            <ArrowUpRight className="w-4 h-4 lg:w-6 lg:h-6" />
            </div>
      </Link>
          </div>

        </CardContent>
      
    </Card>
  );
};

export default NewArrivalsCard;
