
"use client";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { megaMenuItems } from "@/data/megaMenuItems";
import { useGetAllCategoryQuery } from "@/redux/featured/category/categoryApi";
import { MegaMenuItem } from "./Navbar";
import { useMemo } from "react";

const MobileMenu = () => {


  const { data: categories } = useGetAllCategoryQuery();


  const categoriesData: MegaMenuItem[] = useMemo(() => {
    if (!categories) return;

    return categories.slice(0, 9).map((category: any) => ({
      title: category.name,
      link: category.slug,
      items:
        category.subCategories?.map((subCat: any) => ({
          label: subCat.name,
          link: subCat.slug,
        })) || [],
    }));
  }, [categories]);


  const allMenuLabels = Object.keys(megaMenuItems) as Array<
    keyof typeof megaMenuItems
  >;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="px-6 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-4 ">
          
          {/* NAV LINKS */}
          <Accordion type="multiple" className="w-full">
                <Link
              href="/"
              className="block text-sm hover:text-black
            font-semibold mt-6"
            >
              Home
            </Link>
            <Link href="/about" className="block text-sm hover:text-black
            font-semibold mt-6">
              About
            </Link>
          
            {categoriesData?.map((category, catIndex) => (
              <AccordionItem
                key={category.link || catIndex}
                value={category.link || `cat-${catIndex}`}
              >
                <AccordionTrigger className="text-sm font-medium">
                  {category.title}
                </AccordionTrigger>
                <AccordionContent className="pl-4 text-sm space-y-1">
                  {category?.items?.map((sub, subIndex) => (
                    <li key={subIndex} className="list-none">
                      <Link
                        href={`/category/${sub.link}`}
                        className="block hover:text-black transition-colors"
                      >
                        {sub.label}
                      </Link>

                    </li>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}


            {/* Shops */}
            <Link
              href="/shops"
              className="block text-sm hover:text-black
            font-semibold mt-6"
            >
              Shops
            </Link>
            <Link href="/contact-us" className="block text-sm hover:text-black
            font-semibold mt-6">
              Contact Us
            </Link>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
