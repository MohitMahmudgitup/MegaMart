"use client";
import React, { useEffect } from "react";
import SectionHeader from "./SectionHeader";
import { useMemo, useState } from "react";
import NewArrivalsCard from "@/components/cards/NewArrivalsCard";

import { useNewArrivalsListDataQuery } from "@/redux/featured/product/productApi";
import Link from "next/link";
import { NewArrivalsSkeleton } from "./NewArrivalsSkeleton";

interface Product {
  _id: string;
  featuredImg: string;
  description: {
    name: string;
    slug: string;
    description: string;
  };
  productInfo: {
    price: number;
    salePrice?: number;
  };
  brandAndCategories: {
    brand: {
      name: string;
    };
    categories: Array<{
      name: string;
    }>;
    tags: Array<{
      name: string;
    }>;
  };
}



const NewArrivals = () => {
  const { data, isLoading } = useNewArrivalsListDataQuery();
  const [tab, setTab] = useState<string>("");

  const categoryTabs = useMemo(() => {
    if (!data) return [];

    const categories = new Set<string>();
    data.forEach((product: Product) => {
      product.brandAndCategories?.categories?.forEach((category) => {
        if (category.name) {
          categories.add(category.name);
        }
      });
    });

    return Array.from(categories).map((categoryName) => ({
      value: categoryName.toLowerCase(),
      label: categoryName,
    }));
  }, [data]);

  useEffect(() => {
    if (categoryTabs.length > 0 && !tab) {
      setTab(categoryTabs[0].value);
    }
  }, [categoryTabs, tab]);

  const arrivals = useMemo(() => {
    if (!data || !tab) return [];

    const selectedCategory = categoryTabs.find((cat) => cat.value === tab);
    if (!selectedCategory) return data.slice(0, 5);

    const filteredProducts = data.filter((product: Product) => {
      return product.brandAndCategories?.categories?.some(
        (category) => category.name === selectedCategory.label
      );
    });

    return filteredProducts.slice(0, 5);
  }, [data, tab, categoryTabs]);

  const transformedArrivals = useMemo(() => {
    return arrivals.map((product: Product) => ({
      id: product._id,
      title: product.description?.name,
      subtitle: product.description?.description,
      salePrice: product.productInfo?.salePrice,
      image: product.featuredImg,
      price: product.productInfo?.price,
    }));
  }, [arrivals]);

  // Show skeleton while loading
  if (isLoading) {
    return <NewArrivalsSkeleton />;
  }

  return (
    < div className="py-6">
      <SectionHeader
        title="New Arrivals"
        tabs={categoryTabs}
        value={tab}
        onValueChange={(v) => setTab(v as any)}
        viewAllLinkState={true}
      />




      <section className="mt-8">
        <div className="  columns-2
      sm:columns-3
      lg:columns-5
      gap-4
      space-y-4">
          {transformedArrivals.map((product: any) => (
            <NewArrivalsCard key={product.id} {...product} />
          ))}
        </div>
      </section>

     
          <div className="rounded-lg text-center mt-8 lg:hidden block font-semibold text-sm md:text-base xl:text-sm
            px-3 xl:px-5 py-4
              bg-black hover:bg-black
            transition group cursor-pointer">
            <Link href="/product-collection">
              <span className="
                bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
                bg-clip-text text-transparent
                group-hover:text-white
                transition-all duration-300
              ">
                View All
              </span>
            </Link>
          </div>
   
    </div>
  );
};

export default NewArrivals;
