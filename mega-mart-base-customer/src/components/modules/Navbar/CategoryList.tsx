/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { MegaMenuItems } from "@/data/megaMenuItems";
import Masonry from "react-masonry-css";
import CategoryMenuSection from "./CategoryMenuSection";

type Props = {
  items: MegaMenuItems;
  isLoading: any;
};

const breakpointColumnsObj = {
  default: 5,
  1024: 5,
  768: 1,
};

const CategoryList = ({ items, isLoading }: Props) => {
  return (
    <>
      {(Object.keys(items) as Array<keyof MegaMenuItems>).map((menu) => (
        <NavigationMenuItem key={menu}>
          <NavigationMenuTrigger className="bg-white">{menu}</NavigationMenuTrigger>
          <NavigationMenuContent className="p-6 shadow-lg border bg-white">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={`flex gap-6 w-[800px] xl:w-[900px] `}
              columnClassName="space-y-4 w-auto"
            >
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                items[menu]?.map((section, idx) => (
                  <CategoryMenuSection
                    key={`${section.title || "section"}-${idx}`}
                    title={section.title}
                    items={section.items}
                    link={section.link}
                  />
                ))
              )}
            </Masonry>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ))}

      {/* Shops */}
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="/shops" className="hover:text-black">
            Shops
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      {/* Shops */}
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="/contact-us" className="hover:text-black">
            Contact Us
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  );
};

export default CategoryList;
