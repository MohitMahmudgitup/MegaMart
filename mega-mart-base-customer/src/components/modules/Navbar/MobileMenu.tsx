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
import { useGetProductInCategoryQuery } from "@/redux/featured/category/categoryApi";
import { MegaMenuItem } from "./Navbar";
import { useMemo, useState } from "react";

const MobileMenu = () => {
  const { data: categories } = useGetProductInCategoryQuery();
  const [isOpen, setIsOpen] = useState(false); // control Sheet open state

  const categoriesData: MegaMenuItem[] = useMemo(() => {
    if (!categories) return [];
    return categories.slice(0, 9).map((category: any) => ({
      title: category.name,
      link: category._id,
      items:
        category.subCategories?.map((subCat: any) => ({
          label: subCat.name,
          link: subCat._id,
        })) || [],
    }));
  }, [categories]);

  // Close menu when clicking any link
  const handleCloseMenu = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
        <div className="flex flex-col gap-6 mt-4">
          {/* NAV LINKS */}
          <Accordion type="multiple" className="w-full">
            <Link
              href="/"
              onClick={handleCloseMenu}
              className="block text-sm hover:text-black font-semibold mt-6"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={handleCloseMenu}
              className="block text-sm hover:text-black font-semibold mt-6"
            >
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
                        onClick={handleCloseMenu}
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
              onClick={handleCloseMenu}
              className="block text-sm hover:text-black font-semibold mt-6"
            >
              Shops
            </Link>
            <Link
              href="/contact-us"
              onClick={handleCloseMenu}
              className="block text-sm hover:text-black font-semibold mt-6"
            >
              Contact Us
            </Link>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;