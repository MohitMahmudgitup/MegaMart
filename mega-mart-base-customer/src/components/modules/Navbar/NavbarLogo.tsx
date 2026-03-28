"use client";

import React from "react";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import Image from "next/image";
import { useGetSettingsQuery } from "@/redux/featured/setting/settingAPI";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface NavbarLogoProps {
  showSidebar?: boolean;
  setSidebarOpen?: (value: boolean) => void;
  dashboardLocation?: boolean;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({
  showSidebar,  setSidebarOpen,  dashboardLocation,
}) => {
  const { data: settings, isLoading } = useGetSettingsQuery();

  const site: any = settings?.[0] ;

  return (
    <div className="flex items-center gap-4">
    

      {showSidebar && dashboardLocation && (
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen?.(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Logo Image */}
   <div className="flex items-center">
  <Link href="/" className="block">
    <Image
      src={site?.siteLogo ? site?.siteLogo : "/logo.png"}
      alt={site?.siteName || "Logo"}
      width={185}
      height={100}
      className="object-contain w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] h-auto"
      priority
    />
  </Link>
</div>

      {/* Site Name */}
      {/* <Link
        href="/"
        className="hidden sm:inline-block text-2xl font-bold text-gray-800 leading-none tracking-tight"
      >
        {site?.siteName ?  site?.siteName : "Mega Mart"}
      </Link> */}
    </div>
  );
};

export default NavbarLogo;
