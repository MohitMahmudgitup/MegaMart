'use client';

import Image from 'next/image';
import { MoreVertical } from 'lucide-react';

type Product = {
  _id: string;
  name: string;
  featuredImg: string;
  price: number;
  salePrice?: number;
  totalSold?: number;
  totalRevenue?: number;
};

type TrendingProductsProps = {
  comparedTo?: string;
  trendingProducts?: Product[] | null;
};

export default function TrendingProducts({
  comparedTo = 'Last 3 days',
  trendingProducts,
}: TrendingProductsProps) {
  // Ensure trendingProducts is always an array
  const productsArray = Array.isArray(trendingProducts) ? trendingProducts : [];

  return (
    <div className="w-full max-w-full bg-white dark:bg-card rounded-xl shadow-md p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold">Trending Products</h2>
          <p className="text-xs text-muted-foreground">
            Compared to {comparedTo}
          </p>
        </div>
        <MoreVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Product List */}
      <div className="flex-1 space-y-4 overflow-auto">
        {productsArray.length > 0 ? (
          productsArray.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <Image
                    src={product.featuredImg}
                    alt={product.name}
                    width={56}
                    height={56}
                    className="object-contain"
                  />
                </div>

                <div className="truncate">
                  <p className="text-sm font-medium truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Sold: {product.totalSold || 0}, Revenue: ৳{' '}
                    {product.totalRevenue || product.price}
                  </p>
                </div>
              </div>

              <div className="text-sm font-medium whitespace-nowrap">
                ৳ {product.salePrice || product.price}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No trending products found
          </p>
        )}
      </div>
    </div>
  );
}
