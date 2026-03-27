import type React from "react";
import Link from "next/link";
import { Home, Heart, MessageCircleMore} from "lucide-react";
import MobileMenu from "../modules/Navbar/MobileMenu";


export default function SmallNavbar({ showSidebar }: { showSidebar?: any }) {
  return (
    <nav className="bg-white/90 backdrop-blur-md border border-gray-200 fixed bottom-4 inset-x-4 z-50 rounded-full shadow-xl">
      <div className="flex items-center justify-around py-2">

        <NavItem icon={Home} href="/" isActive />

        <NavItem icon={Heart} href="/dashboard/wishlistItems" />

        {/* WhatsApp */}
      <Link
  href="https://wa.me/8801618767729"
  target="_blank"
  rel="noopener noreferrer"
  className="relative flex items-center justify-center p-3 rounded-full hover:scale-110 transition-all duration-300"
>
 
<MessageCircleMore className="w-5 h-5"/>
  {/* Notification Badge */}
  {/* <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full border-2 border-white shadow-sm animate-pulse">
    1
  </span> */}
</Link>

        {!showSidebar && (
          <div className="flex-shrink-0">
            {/* <MobileMenu /> */}
            {/* <TextAlignEnd /> */}
          </div>
        )}
      </div>
    </nav>
  );
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isActive?: boolean;
}

function NavItem({ icon: Icon, href, isActive = false }: NavItemProps) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center justify-center p-3 transition-all duration-300 ${
          isActive
            ? "text-white bg-black rounded-full shadow-md scale-110"
            : "text-gray-500 hover:text-orange-500 hover:scale-110"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
    </Link>
  );
}