"use client";
import { useEffect, useState } from "react";
import { TopNavbar } from "@/components/shared/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/Sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLogoutMutation } from "@/redux/featured/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import { logoutUser, selectCurrentUser } from "@/redux/featured/auth/authSlice";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  ImagePlay,
  Plus,
  ShoppingBag,
  LayoutList,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard },
  { href: "/admin/banners", icon: ImagePlay },
  { href: "/admin/shop-setting", icon: LayoutList },
  { href: "/admin/order", icon: ShoppingBag },
];

function NavIcon({
  href,
  icon: Icon,
  active,
}: {
  href: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200",
        active
          ? "bg-violet-100 dark:bg-violet-950/50"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
      )}
    >
      <Icon
        size={20}
        strokeWidth={active ? 2.2 : 1.8}
        className={cn(
          "transition-colors duration-200",
          active
            ? "text-violet-600 dark:text-violet-400"
            : "text-zinc-400 dark:text-zinc-500"
        )}
      />
    </Link>
  );
}

function MagicNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-5 inset-x-0 flex justify-center z-50 sm:hidden pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center w-80 justify-between gap-1
          bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl
          border border-zinc-200/70 dark:border-zinc-700/60
          rounded-full px-3 py-2
          shadow-[0_4px_24px_rgba(0,0,0,0.10)]"
      >
        {NAV_ITEMS.slice(0, 2).map((item, i) => (
          <NavIcon
            key={i}
            href={item.href}
            icon={item.icon}
            active={pathname === item.href}
          />
        ))}

        {/* Center Add Product */}
        <Link
          href="/admin/add-new-product"
          className="w-11 h-11 mx-1 flex items-center justify-center rounded-full
            bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500
            shadow-[0_2px_12px_rgba(139,92,246,0.45)]
            hover:scale-105 active:scale-95
            transition-transform duration-200"
        >
          <Plus size={20} color="white" strokeWidth={2.5} />
        </Link>

        {NAV_ITEMS.slice(2).map((item, i) => (
          <NavIcon
            key={i}
            href={item.href}
            icon={item.icon}
            active={pathname === item.href}
          />
        ))}
      </nav>
    </div>
  );
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }
    if (currentUser?.role === "customer") {
      const handleLogout = async () => {
        try {
          if (currentUser?._id) await logout(currentUser._id).unwrap();
        } catch (err) {
          console.error(err);
        } finally {
          dispatch(logoutUser());
          toast.error("You are not authorized");
          router.push("/auth/login");
        }
      };
      handleLogout();
    }
  }, [currentUser, router, dispatch]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <div
          className={cn(
            "fixed hidden sm:block top-0 left-0 h-full z-40 transition-all duration-300",
            isSidebarOpen ? "sm:w-64" : "sm:w-11 md:w-20"
          )}
        >
          <AppSidebar
            isOpen={true}
            onClose={() => setIsSidebarOpen(false)}
            isCollapsed={!isSidebarOpen}
          />
        </div>

        <div
          className={cn(
            "flex-1 flex flex-col h-full overflow-hidden transition-all duration-300",
            isSidebarOpen ? "sm:ml-64" : "sm:ml-11 md:ml-20"
          )}
        >
          <div
            className={cn(
              "fixed top-0 right-0 z-30 flex transition-all duration-300 left-0",
              isSidebarOpen ? "sm:left-64" : "sm:left-20"
            )}
          >
            <TopNavbar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </div>

          <main className="flex-1 overflow-y-auto bg-gray-100 mt-16 p-4 md:p-6 pb-28 sm:pb-6">
            {children}
          </main>

          <MagicNav />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;