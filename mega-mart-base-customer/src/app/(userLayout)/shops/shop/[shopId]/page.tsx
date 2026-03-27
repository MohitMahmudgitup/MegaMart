"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetSingleShopQuery } from "@/redux/featured/shop/shopApi";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";

export default function ShopPage() {
  const { shopId } = useParams() as { shopId: string };
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch shop info
  const {
    data: shopData,
    isLoading: shopLoading,
    isError: shopError,
  } = useGetSingleShopQuery(shopId);

  // Fetch all products
  const {
    data: allProductsRaw,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetAllProductsQuery({});

  // Combine loading / error states
  const loading = shopLoading || productsLoading;
  const error = shopError || productsError;

  // Normalize allProducts in case the shape differs
  const allProducts: any[] = Array.isArray(allProductsRaw)
    ? allProductsRaw
    : Array.isArray(allProductsRaw?.data)
    ? allProductsRaw.data
    : [];

  // Filter products by shopId
  const shopProducts = allProducts.filter(
    (p: any) => String(p.shopId) === String(shopId)
  );

  // Filter by search term
  const filteredProducts = shopProducts.filter((product: any) =>
    (product?.description?.name ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to load data.</p>;
  }

  // Extract shop info safely
  const shop = shopData?.data ?? shopData ?? null;

  return (
    <div className="space-y-6 p-4">
      {/* Shop Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200">
          <Image
            src={shop?.logo || "/placeholder.png"}
            alt={shop?.basicInfo?.name || "Shop"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-bold">
            {shop?.basicInfo?.name ?? "Shop"}
          </h2>
          <p className="text-sm text-gray-500">
            {shop?.shopAddress?.city ?? ""}
          </p>
          <p className="text-sm text-gray-500">
            {shopProducts.length} Products
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Input
          placeholder="Search Product..."
          className="pl-10 rounded-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: any) => (
            <div
              key={product._id}
              className="relative rounded-xl shadow-sm overflow-hidden h-[330px] border border-[#E2E8F0] bg-white"
            >
              {/* Product Image */}
              <div className="relative h-2/3 min-w-[242px]">
                <Image
                  src={product.featuredImg || "/placeholder.png"}
                  alt={product.description?.name || "Product"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 ? "fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs md:text-sm font-bold text-[#020817] truncate">
                  {product.description?.name}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-[#FF6933] font-bold text-lg">
                    $
                    {Number(
                      product.productInfo?.salePrice ??
                        product.productInfo?.price ??
                        0
                    ).toFixed(2)}
                  </span>
                  {product.productInfo?.salePrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ${Number(product.productInfo?.price ?? 0).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No products found for this shop.
          </p>
        )}
      </div>
    </div>
  );
}
