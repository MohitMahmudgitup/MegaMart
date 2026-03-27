import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";
import Image from "next/image";
import { LogoPageSkeleton } from "./LogoPageSkeleton";

type Brand = {
  _id: string;
  name?: string;
  icon?: { url?: string };
  createdAt: string;
  image?: string;
};

type Product = {
  brandAndCategories?: { brand?: Brand };
  featuredImg?: string;
};

export default function LogoPage() {
  const { data, isLoading } = useGetAllProductsQuery({});

  // Extract unique brands from products data
  const getBrands = () => {
    if (!data?.length) return [];

    // Create a map to store unique brands
    const brandMap = new Map<string, Brand>();

    data.forEach((product: Product) => {
      const brand = product?.brandAndCategories?.brand;
      if (brand && !brandMap.has(brand._id)) {
        brandMap.set(brand._id, {
          _id: brand._id,
          name: brand.name,
          image: brand.icon?.url || product.featuredImg,
          createdAt: brand.createdAt,
        });
      }
    });

    // Convert map to array and sort by creation date or name
    return Array.from(brandMap.values());
  };

  const brands = getBrands();

  if (isLoading) {
    return <LogoPageSkeleton />;
  }

  return (
    <main className=" bg-background">
      <div className="px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
            Our Top Brand&apos;s
          </h2>

          {/* Brands row */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-7">
            {brands.map((brand) => (
              <div
                key={brand._id}
                className="flex items-center justify-center flex-shrink-0 rounded-lg  relative w-[140px] h-[170px] p-4 sm:p-5 md:p-6"
              >
                <Image
                  src={brand.image || "/placeholder.png"}
                  alt={brand.name || "name"}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/*Pagination dot*/}
          <div className="flex justify-center mt-8">
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
