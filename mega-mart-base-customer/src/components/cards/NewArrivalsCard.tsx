import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  title: string;
  subtitle?: string;
  salePrice: number;
  price: number;
  image: string;
};

const NewArrivalsCard = ({
  id,
  title,
  subtitle,
  salePrice,
  price,
  image,
}: ProductCardProps) => {

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const slug = `${slugify(title)}-${id}`;

  // 🔥 discount calculate
  const discount = Math.round(((price - salePrice) / price) * 100);

  return (
    <Card className="group overflow-hidden border gap-0 py-0 shadow-none relative">
      
      <Link href={`/product-details/${slug}`}>
        <div className="relative w-full h-[150px] sm:h-[235px] lg:h-[200px]">
          
          {/* 🔥 Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 z-10 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-md shadow">
              {discount}%
            </div>
          )}

          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-top"
          />
        </div>
      </Link>

      <CardContent className="p-3">
        <div className="font-medium line-clamp-1 text-sm md:text-base">
          {title}
        </div>

        {subtitle && (
          <div
            className="text-[8px] md:text-xs text-muted-foreground line-clamp-2"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          ></div>
        )}

        <div className="flex justify-between items-center md:mt-4">
          <div className="mt-1 md:text-xl font-semibold flex items-baseline gap-1">
            <span className="text-xl font-bold text-primary">৳</span>
            <span>{salePrice}</span>
            <span className="text-xs sm:text-sm text-gray-400 font-normal line-through">
              ৳{price}
            </span>
          </div>

          <Link href={`/product-details/${slug}`}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <ArrowUpRight className="w-4 h-4 lg:w-6 lg:h-6" />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewArrivalsCard;
