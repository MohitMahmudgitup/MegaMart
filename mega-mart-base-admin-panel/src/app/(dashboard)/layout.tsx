"use client"
import { useEffect, useState } from "react";
import { TopNavbar } from "@/components/shared/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/Sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/redux/featured/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import { logoutUser, selectCurrentUser } from "@/redux/featured/auth/authSlice";
import toast from "react-hot-toast";

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
          if (currentUser?._id) {
            await logout(currentUser._id).unwrap();
          }
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
        {/* Sidebar */}
        <div
          className={cn(
            'fixed hidden sm:block top-0 left-0 h-full  z-40 transition-all duration-300',
            isSidebarOpen ? 'sm:w-64' : 'sm:w-11 md:w-20'
          )}
        >

          <AppSidebar
            isOpen={true} 
            onClose={() => setIsSidebarOpen(false)}
            isCollapsed={!isSidebarOpen}
          />
        </div>

        {/* Main Content */}
        <div
          className={cn(
            'flex-1 flex flex-col h-full overflow-hidden transition-all duration-300',
            isSidebarOpen ? 'sm:ml-64' : 'sm:ml-11 md:ml-20'
          )}
        >

          {/* Top Navigation */}
          <div
            className={`fixed  top-0 right-0 z-30 flex transition-all duration-300
    ${isSidebarOpen ? 'sm:left-64' : 'sm:left-20'} left-0`}
          >
            {/* Mobile Logo */}
            <div className="flex sm:hidden items-center gap-3 p-4 bg-white h-16">
              <Image
                src="https://res.cloudinary.com/dk0ffggfa/image/upload/v1754662720/WhatsApp_Image_2025-08-08_at_8.06.33_PM_mqsnek.jpg"
                alt="Logo"
                width={30}
                height={30}
                className="flex-shrink-0 rounded transition-transform duration-300 hover:scale-110"
              />
            </div>

            {/* Top Navbar */}
            <TopNavbar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </div>


          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-100 mt-16 p-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
