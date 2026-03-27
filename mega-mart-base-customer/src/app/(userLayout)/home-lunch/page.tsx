"use client";


import FAQSection from "@/components/Homecategory/AccordianPage";
import BannerPage from "@/components/Homecategory/Banner";
import CardSection from "@/components/Homecategory/CardSection";
import ContactForm from "@/components/Homecategory/ContactForm";
import MonetizePage from "@/components/Homecategory/Monetize";
import SellerHero from "@/components/Homecategory/SellerHero";
import TestimonialsSection from "@/components/Homecategory/TestimonialsSection";
import { WhySellSection } from "@/components/Homecategory/WhySellSection";
import TopBrands from "@/components/modules/home/top-brands/TopBrands";


export default function Homelucnh() {
  return (
    <div className="space-y-4 md:space-y-16 lg:space-y-20">
      <BannerPage />
      <div className=" bg-white md:rounded-lg  py-5 ">
        <TopBrands />
      </div>
      <CardSection />
      <TestimonialsSection />
      <WhySellSection />
      <MonetizePage />
      <FAQSection />
      <ContactForm />
      <SellerHero />
    </div>
  )
}
