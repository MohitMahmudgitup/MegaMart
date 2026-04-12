

import BestSeller from "@/components/modules/home/best-sellers/BestSeller";
import HeroSection from "@/components/modules/home/hero-section/HeroSection";
import NewArrivals from "@/components/modules/home/new-arrivals/NewArrivals";
import TopBrands from "../../components/modules/home/top-brands/TopBrands";
import NewSpringKnits from "@/components/modules/home/new-spring-knits/NewSpringKnits";
import SaveMore from "@/components/modules/home/save-more/SaveMore";
import DiscountBanner from "@/components/modules/home/discount-banner/DiscountBanner";
import AppPromo from "@/components/modules/home/app-promo/AppPromo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syed Aowlia Online Shop | Home",
  description: "Vendor management website",
};

const HomePage = () => {
  return (
    <main className="space-y-4 md:space-y-16 lg:space-y-20 ">
      <HeroSection />
      <div className=" bg-white md:rounded-lg  p-4 ">
        <NewArrivals />
        <BestSeller />
      </div>
      {/* <DiscountBanner /> */}
      <div className=" bg-white md:rounded-lg  py-5 ">
        <TopBrands />
      </div>
      <NewSpringKnits />
      <SaveMore />
      <AppPromo />
    </main>
  );
};

//

export default HomePage;
