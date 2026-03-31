"use client";

import Link from "next/link";
import {
  ShoppingCart as CartIcon,
  Search,
  User,
  LayoutDashboard,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutUser, selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useLogoutMutation } from "@/redux/featured/auth/authApi";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { selectCustomer } from "@/redux/featured/customer/customerSlice";
import CartSidebar from "@/components/navBer/CartSidebar";
import { Badge } from "@/components/ui/badge";
import PopupProduct from "@/components/modules/Navbar/PopupProduct";
import PopupProductmobile from "./PopupProductmobile";

// TypeScript types
interface CartItem {
  productInfo?: any[];
}

interface Customer {
  cartItem?: CartItem[];
}

interface CurrentUser {
  _id?: string;
  name?: string | null;
  email?: string | null;
}
type NavbarActionsProps = {
  hideSearch: boolean;
  setHideSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavbarActions: React.FC<NavbarActionsProps> = ({ hideSearch, setHideSearch , searchQuery, setSearchQuery , searchOpen, setSearchOpen  }) => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const customerData: Customer = useAppSelector(selectCustomer) || {};
  const cartItems = customerData?.cartItem?.[0]?.productInfo || [];
  const currentUser: CurrentUser | null = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { data: session } = useSession();

  const handleSearchHistory = (query: string) => {
    setSearchHistory((prevHistory) => {
      const updatedHistory = [query, ...prevHistory.filter((item) => item !== query)];
      return updatedHistory.slice(0, 5);
    });
  }


  const handleLogout = async () => {
    if (currentUser?._id) {
      try {
        await logout(currentUser._id).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
    dispatch(logoutUser());
    await signOut({ callbackUrl: "/auth/login" });
  };

  // Helper to get safe string
  const safeString = (value: string | null | undefined) => value || "";
  const handaleSearchOpen = () => {
    setSearchOpen(!searchOpen);
    setHideSearch(false);
  }

  
  return (
    <div className="flex items-center gap-2 relative">
      {/* Search */}
      <div className="relative flex items-center z-50  ">
        <div className={`cursor-pointer  rounded-full transition  block md:hidden `}
          onClick={() =>  handaleSearchOpen()}
        >
          {searchOpen ? <X size={18} /> : <Search size={18} />}
        </div>
         <div className={`cursor-pointer  rounded-full transition  ${hideSearch ? "block" : " hidden md:block" } `}
          onClick={() =>  handaleSearchOpen()}
        >
           <Search size={18} />
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.input
              key="search-input"
              type="text"
              placeholder="Search..."
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: typeof window !== 'undefined' && window.innerWidth < 640 ? 150 : 200,
                opacity: 1
              }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bg-white px-3 py-1 border rounded-lg text-sm outline-none
                 -left-40 sm:-left-52
                 w-[150px] sm:w-[200px] md:block hidden"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Cart */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCartOpen(true)}
        className="relative h-10 w-10"
      >
        <CartIcon className="h-5 w-5" />
        {cartItems.length > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500 hover:bg-orange-600"
          >
            {cartItems.length}
          </Badge>
        )}
      </Button>

      {/* User Dropdown */}
      {currentUser || session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="
        flex items-center gap-3 cursor-pointer
        rounded-full md:px-3 md:p-0 p-0.5 md:py-1.5 ml-1
        bg-gradient-to-r from-violet-600/80 to-indigo-600/80
        hover:from-violet-600 hover:to-indigo-600
        transition-all duration-300
        md:shadow-md hover:shadow-lg
      "
            >
              <Avatar className="h-9 w-9 ring-2 ring-white/40">
                {session?.user?.image ? (
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={session.user.image}
                      alt={safeString(session.user.name)}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <AvatarFallback className="bg-white text-indigo-600">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>

              {/* User Info */}
              <div className="hidden lg:flex flex-col leading-tight min-w-0">
                <span
                  className="text-sm font-semibold text-white truncate max-w-[130px]"
                  title={safeString(currentUser?.name || session?.user?.name)}
                >
                  {currentUser?.name || session?.user?.name}
                </span>
                <span
                  className="text-xs text-white/80 truncate max-w-[130px]"
                  title={safeString(currentUser?.email || session?.user?.email)}
                >
                  {currentUser?.email || session?.user?.email}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="
      w-60 rounded-xl
      bg-white/90 backdrop-blur-xl
      shadow-xl border border-gray-200
      overflow-hidden
    "
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-violet-50">
              <p
                className="text-sm font-semibold text-gray-900 truncate"
                title={safeString(currentUser?.name || session?.user?.name)}
              >
                {currentUser?.name || session?.user?.name}
              </p>
              <p
                className="text-xs text-gray-500 truncate"
                title={safeString(currentUser?.email || session?.user?.email)}
              >
                {currentUser?.email || session?.user?.email}
              </p>
            </div>

            {/* Dashboard */}
            <DropdownMenuItem
              className="
        flex items-center gap-3 px-4 py-2.5
        text-sm font-medium text-gray-700
        hover:bg-indigo-50 hover:text-indigo-600
        transition-colors cursor-pointer
      "
            >
              <LayoutDashboard className="h-4 w-4" />
              <Link href="/dashboard/user-dashboard">Dashboard</Link>
            </DropdownMenuItem>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-1" />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="
        flex items-center gap-3 px-4 py-2.5
        text-sm font-medium text-red-600
        hover:bg-red-50
        transition-colors cursor-pointer
      "
            >
              <span className="text-base">🚪</span>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      ) : (
        <div className="flex md:h-12 h-9   relative md:w-52 w-18   rounded-full ">
          <Link href="/auth/register">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-l-full px-3 md:pl-6 pl-4 md:pr-9 pr-4 h-full py-0 absolute sm:block hidden  md:right-20 right-14  md:py-2 text-xs md:text-sm"
            >
              <p className=" text-xs md:text-sm">Sign Up</p>

            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              size="sm"
              className="rounded-full px-4 font-semibold md:px-8 h-full py-0 absolute right-0 md:py-2 text-xs md:text-sm"
            >
              Log In
            </Button>
          </Link>
        </div>
      )}

      <CartSidebar
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
      />



      {searchQuery.length > 0 && searchOpen && (

     
          <div className="fixed inset-0 z-40  items-start justify-center bg-black/40 overflow-y-auto pt-14 md:flex hidden "
          onClick={() => setSearchOpen(false)}
        >
          <PopupProduct
            onClose={() => setSearchOpen(false)}
            searchQuery={searchQuery}
          />
        </div>

      )}
      {searchQuery.length > 0  && searchOpen && (

        <div
          className="fixed inset-0 z-40 flex items-start justify-center  mt-27 overflow-y-auto md:hidden "
          onClick={() => setSearchOpen(false)}
        >
          <PopupProductmobile
            onClose={() => setSearchOpen(false)}
            setSearchQuery={setSearchQuery}
          />
        </div>

       )} 


    </div>
  );
};

export default NavbarActions;
