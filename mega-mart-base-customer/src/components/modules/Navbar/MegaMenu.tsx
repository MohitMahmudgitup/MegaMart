
"use client";

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useGetSettingsQuery } from "@/redux/featured/setting/settingAPI";
import Link from "next/link";
import Masonry from "react-masonry-css";

type MenuItem = {
  label: string;
  link?: string;
};

const breakpointColumnsObj = {
  default: 4,
  1280: 4,
  1024: 3,
  768: 2,
  640: 1,
};

const MegaMenu = () => {
   const { data: settings, isLoading } = useGetSettingsQuery();

 
  // Static menu items
  const items: MenuItem[] = [
    { label: "All Product Brand", link: "/all-product-brand" },
    { label: "Contact Us", link: "/contact-us" },
    { label: "Home Lunch", link: "/home-lunch" },
    { label: "Product Collection", link: "/product-collection" },
    { label: "Product Listing", link: "/product-listing" },
    { label: "Terms Conditions", link: "/terms-conditions" },
  ];

  if(!isLoading){
    return (
  
      <NavigationMenuItem>
        
  
        <div className="flex gap-2">
             <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={"/"} className="text-gray-700 bg-white font-semibold hover:text-black">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
           <NavigationMenuItem>
          <NavigationMenuLink asChild>
              <Link href={"/about"} className="text-gray-700 bg-white hover:text-black">About</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
  
        
        </div>
  
        <NavigationMenuContent className="p-3 shadow-lg border bg-white rounded-lg">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className=""
  
          >
            {items.map((item, idx) => (
              <div key={idx} className="min-w-[150px]">
                <Link
                  href={item.link || "#"}
                  className="block px-3 py-2 rounded  hover:text-black transition-colors text-sm font-medium"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </Masonry>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );

  }
};

export default MegaMenu;
