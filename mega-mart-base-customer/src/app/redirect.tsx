"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";

// এই routes-এ login ছাড়া যাওয়া যাবে
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/dashboard/checkout", // ✅ guest-ও checkout দেখতে পারবে
];

// এই prefix-এর routes সবসময় public (product pages, home etc)
const publicPrefixes = ["/products", "/category", "/"];

export function RedirectComponent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(pathname);
    const isPublicPrefix = publicPrefixes.some(
      (prefix) => prefix !== "/" && pathname.startsWith(prefix)
    );
    const isHomePage = pathname === "/";

    if (!currentUser && !isPublicRoute && !isPublicPrefix && !isHomePage) {
      router.replace("/auth/login");
    }
  }, [currentUser, pathname, router]);

  return <>{children}</>;
}