"use client";

import type React from "react";
import Link from "next/link";
import { Home, Heart, MessageCircleMore } from "lucide-react";
import MobileMenu from "../modules/Navbar/MobileMenu";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function SmallNavbar({ showSidebar }: { showSidebar?: any }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 inset-x-4 z-50">
      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-full shadow-2xl px-4 py-2 flex items-center justify-around">

        <NavItem icon={Home} href="/" active={pathname === "/"} />
        <NavItem
          icon={Heart}
          href="/dashboard/wishlistItems"
          active={pathname === "/dashboard/wishlistItems"}
        />

        {/* WhatsApp Magic Button */}
        <motion.a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
          target="_blank"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.15 }}
          className="relative flex items-center justify-center p-3 rounded-full bg-green-500 text-white shadow-lg"
        >
          <MessageCircleMore className="w-5 h-5" />

          {/* Glow Effect */}
          <span className="absolute inset-0 rounded-full bg-green-400 blur-xl opacity-40 animate-pulse"></span>
        </motion.a>

        {!showSidebar && <MobileMenu />}
      </div>
    </nav>
  );
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  active?: boolean;
}

function NavItem({ icon: Icon, href, active = false }: NavItemProps) {
  return (
    <Link href={href} className="relative flex flex-col items-center">
      <motion.div
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.2 }}
        className="relative z-10 p-3"
      >
        <Icon
          className={`w-5 h-5 transition-colors duration-300 ${
            active ? "text-white" : "text-gray-500"
          }`}
        />
      </motion.div>

      {active && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-black rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
    </Link>
  );
}