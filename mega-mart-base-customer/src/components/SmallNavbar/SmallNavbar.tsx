"use client";

import type React from "react";
import Link from "next/link";
import { Home, Heart, MessageCircleMore } from "lucide-react";
import MobileMenu from "../modules/Navbar/MobileMenu";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SmallNavbar({ showSidebar }: { showSidebar?: any }) {
  const pathname = usePathname();

  const [showPopup, setShowPopup] = useState(false);
  const [showTyping, setShowTyping] = useState(true);

  useEffect(() => {
    const typingTimer = setTimeout(() => setShowTyping(false), 1500); // typing first
    const popupTimer = setTimeout(() => setShowPopup(true), 2000); // then show msg
    const hideTimer = setTimeout(() => setShowPopup(false), 7000);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(popupTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <nav className="fixed bottom-4 inset-x-4 z-50">
      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-full shadow-2xl px-4 py-2 flex items-center justify-around">

        <NavItem icon={Home} href="/" active={pathname === "/"} />
        <NavItem
          icon={Heart}
          href="/dashboard/wishlistItems"
          active={pathname === "/dashboard/wishlistItems"}
        />

        {/* WhatsApp Button + Chat Animation */}
        <div className="relative flex flex-col items-center">

          {/* Typing Animation */}
          <AnimatePresence>
            {showTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: -10 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-14 bg-white px-3 py-2 rounded-full shadow-lg flex items-center gap-1"
              >
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Popup */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: -10 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute bottom-14 bg-white text-gray-800 text-xs px-4 py-2 rounded-2xl shadow-xl whitespace-nowrap flex items-center gap-2"
              >
                <span className="text-green-500 text-sm">●</span>
                Chat now! 👋

                {/* Arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-white rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp Button */}
          <motion.a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.15 }}
            animate={{
              y: [0, -6, 0], // floating effect
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="relative flex items-center justify-center p-3 rounded-full bg-green-500 text-white shadow-lg"
          >
            <MessageCircleMore className="w-5 h-5" />

            {/* Glow */}
            <span className="absolute inset-0 rounded-full bg-green-400 blur-xl opacity-40 animate-pulse"></span>
          </motion.a>
        </div>

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