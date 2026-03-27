"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Gift, PackageOpen } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SubCategory {
  _id: string;
  name: string;
  slug?: string; 
}

interface Category {
  _id: string;
  name: string;
  image: string;
  slug?: string;
  subCategories?: SubCategory[];
}

interface SidebarProps {
  banners?: { banners?: Category[]; categories?: Category[] }; // API object
}

const Sidebar = ({ banners }: SidebarProps) => {
  const [open, setOpen] = useState<string | null>(null);

  // ✅ categories list
  const categoriesArray = Array.isArray(banners?.categories)
    ? banners.categories
    : [];


  const mappedCategories = categoriesArray.map((cat) => ({
    id: cat._id,
    label: cat.name,
    image: cat.image || "/images/categories/default.png",
    link: cat.slug,
    children: cat.subCategories?.map((sub, idx) => ({
      id: sub._id || `${cat._id}-sub-${idx}`,
      label: sub.name || `Subcategory ${idx + 1}`,
      link: sub.slug,
    })),
  }));


  

  // ✅ Dynamic link helper (like Promo)
  const getLink = (item?: { link?: string }, fallback = "/category/all") => {
    return `/category/${item?.link}` || fallback;
  };

  return (
    <aside className="md:rounded-[16px] w-full lg:w-[280px] xl:w-[375px] shrink-0  bg-white p-4 lg:p-6 ">
      <div className="rounded-2xl p-4 mt-8 lg:mt-0">
        {/* 🧭 Categories List */}
        <ul className="space-y-5">
          {mappedCategories.map((cat) => {
            const isOpen = open === cat.id;
            return (
              <li key={cat.id}>
                <div
                  onClick={() => setOpen(isOpen ? null : cat.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl bg-[#F5F6F6] px-3 py-2 text-sm cursor-pointer transition",
                    isOpen ? "bg-muted/60" : "hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center gap-2 font-medium bg-[#E8E8E8] p-2 rounded-full relative w-12 xl:w-16 h-12 xl:h-16">
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        width={64}
                        height={64}
                        className="rounded-sm object-contain"
                      />
                    </div>

                    {/* 🏷 Category Link */}
                    <Link
                      href={getLink(cat)}
                      className="font-medium xl:text-lg "
                    >
                      {cat.label}
                    </Link>
                  </div>

                  {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>

                {/* 🔽 Subcategories */}
                {isOpen && cat.children?.length ? (
                  <ul className="mt-1 space-y-2 pl-6">
                    {cat.children.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={getLink(sub)}
                          className="block text-muted-foreground hover:text-foreground text-sm px-3 py-1.5 rounded-lg hover:bg-muted/40 transition"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>

        {/* 🧩 Footer Links */}
        <div className="mt-4 space-y-6 p-4 opacity-90">
          <Link href={'/product-listing'}>
            <span
              className="flex items-center gap-2 xl:text-lg hover:underline"
            >
              <PackageOpen size={24} /> Popular Products
            </span>
          </Link>

          <Link href={'/product-listing'}>
            <span
              className="flex items-center gap-2 xl:text-lg hover:underline"
            >
              <Gift size={24} /> Gift Packages
            </span>
          </Link>

          <div className="flex justify-center">
            <Link href={'/product-collection'}>
              <Button className="mt-8 xl:py-6   rounded-[12px]" >
                Go To Collection <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
