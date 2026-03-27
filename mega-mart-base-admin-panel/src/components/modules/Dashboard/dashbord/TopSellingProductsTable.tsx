"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

// types/Product.ts
export interface Product {
  product: string;
  productName: string;
  category: string;
  stock: string;
  totalSales?: number;
}

export interface TopSellingProductsProps {
  title?: string;
  filterLabel?: string;
  products?: Product[];
}

export default function TopSellingProducts({
  title = "Top Selling Products",
  filterLabel = "This Year",
  products = [],
}: TopSellingProductsProps) {
  // ✅ Handle empty or missing products
  if (!products.length) {
    return (
      <div className="w-full max-w-full bg-white dark:bg-card rounded-xl shadow-md overflow-hidden p-6 text-center text-muted-foreground">
        <p>No top-selling products available.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full bg-white dark:bg-card rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button className="bg-black text-white hover:bg-zinc-800" size="sm">
          {filterLabel}
        </Button>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-4 whitespace-nowrap">Product</th>
              <th className="p-4 whitespace-nowrap">Product Name</th>
              <th className="p-4 whitespace-nowrap">Category</th>
              <th className="p-4 whitespace-nowrap">Stock</th>
              <th className="p-4 whitespace-nowrap text-right">Total Sales</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product, idx) => (
              <tr key={idx}>
                <td className="p-4">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <Image
                      src={product.product}
                      alt={product.productName}
                      width={40}
                      height={40}
                      className="object-contain rounded-full"
                    />
                  </div>
                </td>
                <td className="p-4 font-medium">{product.productName}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">
                  <span
                    className={
                      product.stock === "Available"
                        ? "text-green-600 font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="p-4 text-right text-muted-foreground">
                  ${product?.totalSales?.toLocaleString() || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
