/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import DashboardSideber from "@/components/Siderbar-dashbord/Dashbord-sideber";
import SmallNavbar from "@/components/SmallNavbar/SmallNavbar";
import Navbar from "@/components/modules/Navbar/Navbar";
import { useSelector } from "react-redux";
import { logoutUser, selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/featured/auth/authApi";
import toast from "react-hot-toast";
import Footer from "@/components/modules/Footer/Footer";

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const isCheckoutPage = pathname.startsWith("/dashboard/checkout");
  // Orders page-এ guest user allow করা হয়েছে
  const isOrdersPage = pathname.startsWith("/dashboard/orders");

  // Guest user যেসব page access করতে পারবে
  const isGuestAllowedPage = isCheckoutPage || isOrdersPage;

  const showSidebar = !isCheckoutPage;

  // Auth check — guest-allowed pages-এ কিছুই করবে না
  useEffect(() => {
    if (isGuestAllowedPage) return;

    if (!currentUser || currentUser.role !== "customer") {
      const handleLogout = async () => {
        try {
          if (currentUser?._id) {
            await logout(currentUser._id).unwrap();
          }
        } catch (err) {
          console.error(err);
        } finally {
          dispatch(logoutUser());
          toast.error("You are not authorized");
        }
      };

      handleLogout();
    }
  }, [currentUser, router, dispatch, isGuestAllowedPage]);

  // Sidebar scroll lock
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", sidebarOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-40 bg-white">
        <div className="w-full flex items-center justify-between">
          <div className="w-full">
            <Navbar
              showSidebar={showSidebar}
              setSidebarOpen={setSidebarOpen}
              dashboardLocation
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 w-full mt-20 max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        {showSidebar && (
          <aside className="hidden lg:block w-64 sticky top-20 h-full">
            <DashboardSideber />
          </aside>
        )}

        {/* Mobile Sidebar Overlay */}
        {showSidebar && sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex flex-col w-72 max-w-[80vw] h-full bg-white border-r">
              <div className="flex items-center justify-between p-4">
                <h2 className="text-lg font-semibold">📋 Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <DashboardSideber onClose={() => setSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 w-full overflow-x-hidden ml-4">
          <div className="mx-auto w-full">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden">
        <SmallNavbar />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}