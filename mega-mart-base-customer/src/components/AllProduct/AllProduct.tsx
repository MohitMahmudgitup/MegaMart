/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect } from "react";
import TopBrands from "@/components/modules/home/top-brands/TopBrands";
import AdidasCollection from "@/components/modules/all-product-brand/AdidasCollection";
import DiscountBanner from "@/components/modules/all-product-brand/DiscountBanner";
import SaveMoreSection from "@/components/modules/all-product-brand/SaveMoreSection";
import AppPromo from "@/components/modules/all-product-brand/AppPromo";

import { useGetAllBrandsQuery, useGetSingleBrandQuery } from "@/redux/featured/brand/brandApi";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";
import { useAppDispatch } from "@/redux/hooks";
import { setBrands } from "@/redux/featured/brand/brandSlice";
import { setProducts } from "@/redux/featured/product/productSlice";
import { Slider } from "@/components/modules/all-product-brand/slider";
import { SliderSkeleton } from "@/components/modules/all-product-brand/SliderSkeleton";
import SaveMore from "../modules/home/save-more/SaveMore";
import Hero from "../modules/all-product-brand/Hero";
import { useGetProductsByBrandQuery } from "@/redux/featured/Banner/bannerApi";

export default function AllProductPage({id} : {id: string}) {
  const dispatch = useAppDispatch();
  const { data: singleBrandData } = useGetSingleBrandQuery(id);
   const { data: productsByBrandData } = useGetProductsByBrandQuery(id);
  // Fetch brands
  const { data: brandsData } = useGetAllBrandsQuery();

  useEffect(() => {
    if (brandsData) {
      dispatch(setBrands(brandsData));
    }
  }, [brandsData, dispatch]);

  // Fetch products
  const { data: productsData } = useGetAllProductsQuery({});

  useEffect(() => {
    if (productsData) {
      dispatch(setProducts(productsData));
    }
  }, [productsData, dispatch]);

  return (
    <div className="space-y-4 md:space-y-16 lg:space-y-20">
      {/* {brandsLoading || productsLoading ? <SliderSkeleton /> : <Slider />} */}
      <Hero brandsData={singleBrandData} />
      <div className=" bg-white rounded-lg  py-5 ">
        <TopBrands />
      </div>
      <AdidasCollection productsData={productsByBrandData} />
      <DiscountBanner />
      <SaveMore />
      <AppPromo />
    </div>
  );
}
