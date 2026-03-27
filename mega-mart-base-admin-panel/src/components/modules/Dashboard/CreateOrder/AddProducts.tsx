'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/shared/SearchInput';
import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  description: { name: string };
  productInfo: {
    sku: string;
    quantity: number;
    price: number;
    salePrice?: number;
  };
  featuredImg?: string;
}

interface AddProductsProps {
  products: Product[];
  setSelectedProducts: any;
  selectedProducts: any;
  setSearchTerm: any;
  searchTerm:any
}

const AddProducts = ({
  products,
  selectedProducts,
  setSelectedProducts,
  setSearchTerm,
  searchTerm,
}: AddProductsProps) => {
  const handleAddProduct = (product: Product) => {
    setSelectedProducts((prev: any) => [
      ...prev,
      { productId: product._id, quantity: 1 },
    ]);

    toast.success(`${product.description.name} added`);
  };

  const handleRemove = (id: string) => {
    setSelectedProducts((prev: any) =>
      prev.filter((p: any) => p.productId !== id)
    );
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-semibold opacity-90 flex items-center gap-2">
          Add Products
          {selectedProducts.length > 0 && (
            <span className="text-base font-medium text-rose-600">
              ({selectedProducts.length} selected)
            </span>
          )}
        </h2>

        <p className="text-sm mb-8 opacity-60">
          Search and add products to the order
        </p>

        <SearchInput
          placeholder="Search products by name or SKU..."
          className="mb-4"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        {products.length === 0 ? (
          <p className="text-center text-sm opacity-60">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[500px] overflow-y-scroll">
            {products.map(product => (
              <div
                key={product._id}
                className="border rounded-md p-3 flex flex-col justify-between"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{product.description.name}</p>
                    <p className="text-sm opacity-60">
                      {product.productInfo.sku}
                    </p>
                  </div>
                  <span className="text-xs opacity-60">
                    Stock: {product.productInfo.quantity}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[#023337] text-sm">
                    $
                    {product.productInfo.salePrice || product.productInfo.price}
                  </p>
                  {selectedProducts.find(
                    (p: any) => p.productId === product._id
                  ) ? (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleRemove(product._id)}
                        variant="outline"
                        size="sm"
                        className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleAddProduct(product)}
                      variant="outline"
                      size="sm"
                    >
                      +
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddProducts;
