/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Minus,
  Plus,
  Search,
  User,
  ShoppingCart as CartIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import MegaMenu from "../modules/Navbar/MegaMenu";
import { megaMenuItems } from "@/data/megaMenuItems";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetSingleCustomerQuery } from "@/redux/featured/customer/customerApi";
import { selectCurrentUser, setUser } from "@/redux/featured/auth/authSlice";
import CartSidebar from "./CartSidebar";
import {
  selectCustomer,
  setCustomer,
} from "@/redux/featured/customer/customerSlice";
import NavbarLogo from "../modules/Navbar/NavbarLogo";
import CategoryList from "../modules/Navbar/CategoryList";
import NavbarActions from "../modules/Navbar/NavbarActions";
import { useGetMeQuery } from "@/redux/featured/auth/authApi";
import { useGetAllCategoryQuery } from "@/redux/featured/category/categoryApi";
import Navbar from "../modules/Navbar/Navbar";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface MegaMenuItem {
  title: string;
  link?: string;
  items?: { label: string; link: string }[];
}

interface MegaMenuItems {
  [key: string]: MegaMenuItem[];
}
export default function ShoppingPage() {
  const dispatch = useAppDispatch();
  const { data: user } = useGetMeQuery(undefined);

  const { data: categories, isLoading } = useGetAllCategoryQuery();

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

  const categoriesItems: MegaMenuItems = {
    Categories: categoriesData,
  };

  return (
    <div className="relative flex">
      <div className="hidden lg:flex items-center gap-6">
        <NavigationMenu>
          <NavigationMenuList className="text-sm font-medium">
            {/* <MegaMenu items={megaMenu} /> */}
            <MegaMenu />
            <CategoryList items={categoriesItems} isLoading={isLoading} />
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Icons & Auth buttons */}
      {/* <NavbarActions /> */}
    </div>
  );
}
