/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useEffect, useMemo } from "react";
import { setCustomer } from "@/redux/featured/customer/customerSlice";
import { useGetMeQuery } from "@/redux/featured/auth/authApi";
import { useGetAllCategoryQuery } from "@/redux/featured/category/categoryApi";
import CategoryList from "./CategoryList";
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
  setSidebarOpen
}: {
  showSidebar?: any;
    setSidebarOpen?: any;
    dashboardLocation?: boolean;
}) => {
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
    <nav className="w-full fixed z-50 2xl:px-0 md:px-8 px-0">
      <div className="2xl:max-w-7xl rounded-xl bg-white mx-auto flex items-center justify-between px-2 md:px-4 lg:px-6 py-3">
        {/* Logo */}
        <NavbarLogo showSidebar={showSidebar} setSidebarOpen={setSidebarOpen} dashboardLocation />

        {/* Desktop NavLinks */}
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
        <NavbarActions />
      </div>
    </nav>
  );
};

export default Navbar;
