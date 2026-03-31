"use client";

import Footer from "@/components/modules/Footer/Footer";
import Navbar from "@/components/modules/Navbar/Navbar";
import SmallNavbar from "@/components/SmallNavbar/SmallNavbar";

const DashboardLayout = ({ children , showSidebar }: { children: React.ReactNode, showSidebar?: boolean }) => {
  return (
    <div className="overflow-x-hidden relative mt-0 lg:mt-2">
     {/* <div className="bg-[#5f63684b] w-[500px] h-[500px] absolute rounded-full -right-20 -top-10 -z-10 "></div>
     <div className="bg-[#5f63684b] w-[500px] h-[500px] absolute rounded-full -right-20 bottom-0 -z-10 "></div>
     <div className="bg-[#5f63684b] w-[500px] h-[500px] absolute rounded-full -left-90 top-[800px] -z-10 "></div> */}

      <Navbar showSidebar={showSidebar} />
      <div className="2xl:max-w-7xl 2xl:px-0 md:px-8 px-0 mx-auto min-h-screen sm:pt-20 pt-28.5">
        {children}
      </div>
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden">
        <SmallNavbar showSidebar={showSidebar} />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
