"use client";
// import ShippingCategories from "@/components/modules/Dashboard/Shipping/ShippingCategories";
import StatsCards from "@/components/shared/StatsCards";
import CreateAndUpdateShipping from "@/components/shippings/CreateAndUpdateshipping";
import ShippingManagementTable from "@/components/tables/ShippingManagementTable";
import { useGetAllShippingStatsQuery } from "@/redux/featured/shipping/shippingApi";
import React from "react";
import AttributeManagementSkeleton from "../loadings/AttributeManagementSkeleton";

const Shipping = () => {
  const { data: Stats,isLoading} = useGetAllShippingStatsQuery({});
  if (isLoading) return <AttributeManagementSkeleton />
  return (
    <div className="py-6 p-2 sm:p-4">
      <div className="flex justify-end mb-4">
        <CreateAndUpdateShipping>+ Add Shipping method</CreateAndUpdateShipping>
      </div>
      <StatsCards items={Stats} />
      {/* <ShippingCategories items={Stats?.details} /> */}
      <ShippingManagementTable />
    </div>
  );
};

export default Shipping;
