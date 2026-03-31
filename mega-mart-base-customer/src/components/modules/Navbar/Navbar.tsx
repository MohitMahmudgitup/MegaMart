/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import MegaMenu from "./MegaMenu";
import { megaMenuItems } from "@/data/megaMenuItems";

import NavbarLogo from "./NavbarLogo";
import NavbarActions from "./NavbarActions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetSingleCustomerQuery } from "@/redux/featured/customer/customerApi";
import { selectCurrentUser, setUser } from "@/redux/featured/auth/authSlice";
import { useEffect, useMemo, useState } from "react";
import { setCustomer } from "@/redux/featured/customer/customerSlice";
import { useGetMeQuery } from "@/redux/featured/auth/authApi";
import { useGetAllCategoryQuery } from "@/redux/featured/category/categoryApi";
import CategoryList from "./CategoryList";
import { Search , X } from "lucide-react";

export interface MegaMenuItem {
  title: string;
  link?: string;
  items?: { label: string; link: string }[];
}

interface MegaMenuItems {
  [key: string]: MegaMenuItem[];
}

const Navbar = ({
  showSidebar,
  setSidebarOpen,
}: {
  showSidebar?: any;
  setSidebarOpen?: any;
  dashboardLocation?: boolean;
}) => {
  const dispatch = useAppDispatch();

  // 🔥 search hide state
  const [hideSearch, setHideSearch] = useState(false);

  const { data: user } = useGetMeQuery(undefined);
  const { data: categories, isLoading } = useGetAllCategoryQuery();

  // 🔥 Scroll Animation Logic
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setHideSearch(true);
        setSearchOpen(false);
      }
      if (window.scrollY < lastScrollY && window.scrollY < 50) {
        setHideSearch(false);
      }

      if (hideSearch === false && window.scrollY < 50) {
        setHideSearch(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(setUser(user?.data));
    }
  }, [user, dispatch]);

  const currentUser = useAppSelector(selectCurrentUser);

  const { data: CustomerData } = useGetSingleCustomerQuery(
    currentUser?._id as string,
    {
      skip: !currentUser?._id,
    }
  );

  useEffect(() => {
    if (CustomerData) {
      dispatch(setCustomer(CustomerData));
    }
  }, [CustomerData, dispatch]);

  const categoriesData: MegaMenuItem[] = useMemo(() => {
    if (!categories) return [];

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

  const categoriesItems: MegaMenuItems = {
    Categories: categoriesData,
  };
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  console.log(searchOpen)
  const handaleSearchOpen = () => {
    setSearchOpen(true);
    setHideSearch(false);
  }
  const handaleSearchOpenX = () => {
    setSearchOpen(true);
    setHideSearch(true);
    setSearchQuery("");
  }
 

  return (
    <nav className={`w-full fixed top-0 z-50 2xl:px-0 md:px-8 px-0 ${hideSearch ? "" : "bg-white rounded-xl md:bg-transparent md:rounded-none"}`}>
      <div className={`2xl:max-w-7xl  bg-white mx-auto px-2 md:px-4 lg:px-6 sm:py-3   ${hideSearch ? "rounded-xl py-2 " : "rounded-t-xl md:rounded-xl p-2"}`}>

        {/* Top Navbar */}
        <div className="flex items-center justify-between rounded-xl ">

          {/* Logo */}
          <NavbarLogo
            showSidebar={showSidebar}
            setSidebarOpen={setSidebarOpen}
            dashboardLocation
          />

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList className="text-sm font-medium">
                <MegaMenu />
                <CategoryList items={categoriesItems} isLoading={isLoading} />
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Actions */}
          <NavbarActions
            hideSearch={hideSearch}
            setHideSearch={setHideSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}

          />
        </div>


      </div>
      {/* 🔍 Search Bar with Animation */}
      <div
        className={`w-full max-w-md md:hidden block mx-auto  pb-2 px-2 transition-all duration-300 ease-in-out ${hideSearch
            ? "opacity-0 -translate-y-5 pointer-events-none "
            : "opacity-100 translate-y-0 rounded-b-xl bg-white "
          }`}
      >
        <div className="flex items-center gap-2 pr-1 pl-4 py-1 bg-[#F3F3F6] rounded-full" onClick={handaleSearchOpen} >

          <input
            type="text"
            placeholder="what are you looking for?"
            className="w-full outline-none text-sm bg-transparent placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            
          />

          <div className="p-2 rounded-full bg-white hover:bg-zinc-200 cursor-pointer transition"  onClick={handaleSearchOpenX}>
            { searchOpen ? <X className="w-5 h-5 text-black"  /> : <Search className="w-5 h-5 text-black" />}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;