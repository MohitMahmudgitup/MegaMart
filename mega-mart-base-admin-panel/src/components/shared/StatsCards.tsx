import { Card, CardContent } from "@/components/ui/card";
import { Box, Clock, Truck } from "lucide-react";
import React, { ReactNode } from "react";



const StatsCards = ({ items }: {items:any}) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2
    xl:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6"
    >
      <Card className="rounded-[8px]">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm opacity-80 ">Shipping Methods</p>
            <span className="text-xl">
              <Truck className="text=[#000000]" />
            </span>
          </div>

          <h2 className="text-xl font-semibold">{items?.shippingMethods} </h2>
          <p className="text-xs mt-1 opacity-60">Active Methods</p>
        </CardContent>
      </Card>{' '}
      <Card className="rounded-[8px]">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm opacity-80 ">Carries</p>
            <span className="text-xl">
              <Box className="text-[#C710EB]" />
            </span>
          </div>

          <h2 className="text-xl font-semibold">{items?.carriers}</h2>
          <p className="text-xs mt-1 opacity-60">Integrated partners</p>
        </CardContent>
      </Card>{' '}
      <Card className="rounded-[8px]">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm opacity-80 ">avgDeliveryTime</p>
            <span className="text-xl">
              <Clock className="text-[#F97316]" />
            </span>
          </div>

          <h2 className="text-xl font-semibold">{items?.avgDeliveryTime}</h2>
          <p className="text-xs mt-1 opacity-60">Days Average</p>
        </CardContent>
      </Card>{' '}
      <Card className="rounded-[8px]">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm opacity-80 ">revenue</p>
            <span className="text-xl">
              <Truck />
            </span>
          </div>

          <h2 className="text-xl font-semibold">{items?.revenue}</h2>
          <p className="text-xs mt-1 opacity-60">this month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
