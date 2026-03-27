"use client";

import * as React from "react";
import LastVendorPayoutTable from "@/components/modules/Dashboard/dashbord/LastVendorPayoutTable";
import Maps from "@/components/modules/Dashboard/dashbord/Maps";
import { RecentOrdersTable, transformRecentOrders } from "@/components/modules/Dashboard/dashbord/RecentOrdersTable";
import SalesCostCard from "@/components/modules/Dashboard/dashbord/SalesCostCard";
import SalesHistoryChart from "@/components/modules/Dashboard/dashbord/SalesHistoryChart";
import SessionCard from "@/components/modules/Dashboard/dashbord/SessionCard";
import TodayOrderChart from "@/components/modules/Dashboard/dashbord/TodayOrderChart";
import TopSellingCategory from "@/components/modules/Dashboard/dashbord/TopSellingCategory";
import TopSellingProducts from "@/components/modules/Dashboard/dashbord/TopSellingProductsTable";
import TrendingProducts from "@/components/modules/Dashboard/dashbord/TrendingProducts";
import VendorCard from "@/components/modules/Dashboard/dashbord/VendorCard";
import OrderCard, { OrderCardProps } from "@/components/shared/OrderCard";
import ShopCard from "@/components/shared/ShopCard";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useGetAdminStatsQuery } from "@/redux/featured/Dashboards/DashboardsApi";
import DashboardSkeleton from "./DashboardSkeleton";



const AdminDashboard = () => {
  const [date, setDate] = React.useState<Date>();
  const { data: AllDashboard,isLoading } = useGetAdminStatsQuery()

  // Extract data safely
  const salesData =
    AllDashboard?.SalesAndCostStats?.stats?.map((item: any) => ({
      day: item.day,
      sales: item.totalSales,
      cost: item.totalCost,
    })) || [];

  const growth = AllDashboard?.SalesAndCostStats?.totalSalesSum || 0;
  const days = AllDashboard?.SalesAndCostStats?.days || 0;

  const totalOrders = AllDashboard?.TotalOrdersStats?.totalOrders || 0;
  const totalProfit = AllDashboard?.ProfitStats?.totalSales || 0;
  const totalVendors = AllDashboard?.TotalVendorsStats?.totalVendors || 0;
  const totalShops = AllDashboard?.TotalShopsStats?.totalShops || 0;
  const pendingOrders = AllDashboard?.PendingOrder?.totalOrders || 0;
  const processingOrders = AllDashboard?.ProcessingOrder?.totalOrders || 0;
  const completedOrders = AllDashboard?.CompletedOrder?.totalOrders || 0;
  const cancelledOrders = AllDashboard?.CancelledOrder?.totalOrders || 0;


  const ordersData = [
    { value: 18000 },
    { value: 20000 },
    { value: 19000 },
    { value: 22000 },
    { value: 21000 },
    { value: 23000 },
    { value: 25700 },
  ];

  const activeOrdersData = [
    { value: 12000 },
    { value: 13000 },
    { value: 12500 },
    { value: 14000 },
    { value: 14500 },
    { value: 15000 },
    { value: 15500 },
  ];

  // Define CardConfig type
  type CardConfig = { type: "order"; props: OrderCardProps } | { type: "vendor" };

  const cardConfig: CardConfig[] = [
    {
      type: "order",
      props: {
        title: "Total Orders",
        value: totalOrders,
        change: AllDashboard?.TotalOrdersStats?.percentChange || 0,
        chartData: ordersData,
      },
    },
    {
      type: "order",
      props: {
        title: "Total Profit",
        value: totalProfit,
        change: AllDashboard?.ProfitStats?.percentChange || 0,
        chartData: activeOrdersData,
      },
    },
    { type: "vendor" },
  ];

  if (isLoading) return <DashboardSkeleton/>

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Explore now</h1>

        {/* Calendar */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-full border border-gray-300 px-3 py-2 text-xs sm:text-sm font-medium
                flex items-center gap-2 whitespace-nowrap
                hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500
                transition duration-200 ease-in-out"
              aria-label="Select date range"
            >
              <CalendarIcon className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 select-none hidden sm:inline">
                {date ? format(date, "PPP") : "Last 28 Days"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" side="bottom" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Row 1: Sales and Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesCostCard chartData={salesData} growth={growth} days={days} />
        </div>
        <SessionCard userStats={AllDashboard?.UserStats} />
      </div>

      {/* Row 2: Orders and Vendors (Dynamic Loop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cardConfig.map((card, index) =>
          card.type === "order" ? (
            <OrderCard key={index} {...card.props} />
          ) : (
            <VendorCard key={index}
              comparedTo={AllDashboard?.TotalVendorsStats?.comparedTo || "Last 3 days"}
              totalVendors={AllDashboard?.TotalVendorsStats?.totalVendors || 0}
            />

          )
        )}
      </div>

      {/* Row 3: Shops */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Link href={"/all-shop"}>
          <ShopCard title="Total Shops" subtitle={AllDashboard?.TotalShopsStats?.comparedTo || "Last 3 days"} count={totalShops} />
        </Link>
        <Link href={"/all-shop"}>
          <ShopCard title="Pending Order" subtitle={AllDashboard?.PendingOrder?.comparedTo || "Last 3 days"} count={pendingOrders} />
        </Link>
        <Link href={"/all-shop"}>
          <ShopCard
            title="Processing Order"
            subtitle={AllDashboard?.ProcessingOrder?.comparedTo || "Last 3 days"}
            count={processingOrders}
          />
        </Link>
        <Link href={"/all-shop"}>
          <ShopCard
            title="Completed Order"
            subtitle={AllDashboard?.CompletedOrder?.comparedTo || "Last 3 days"}
            count={completedOrders}
          />
        </Link>
        <Link href={"/all-shop"}>
          <ShopCard
            title="Cancelled Order"
            subtitle={AllDashboard?.CancelledOrder?.comparedTo || "Last 3 days"}
            count={cancelledOrders}
          />
        </Link>
      </div>

      {/* Row 4: Top selling products & trending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TopSellingProducts products={AllDashboard?.TopSellingProductsStats || []} />
        </div>
        <TrendingProducts
          trendingProducts={AllDashboard?.TrendingProductsStats?.trendingProducts || []}
          comparedTo={AllDashboard?.TrendingProductsStats?.comparedTo || "Last 3 days"}
        />

      </div>

      {/* Row 5: Today's orders & recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <TodayOrderChart totalOrders={AllDashboard?.TodayOrdersStats?.todayCount || 0} percentageChange={AllDashboard?.TodayOrdersStats?.percentChange || 0} chartData={AllDashboard?.TodayOrdersStats?.todayHourlyData?.map(item => ({
            time: item.hourLabel,
            value: item.count,
          })) || []} />
        </div>
        <div className="lg:col-span-2">
          <RecentOrdersTable RecentOrders={transformRecentOrders(AllDashboard?.RecentOrders || [])} />
        </div>
      </div>

      {/* Row 6: Last vendor payout & top category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LastVendorPayoutTable />
        </div>
        <TopSellingCategory />
      </div>

      {/* Row 7: Map & sales history */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <Maps />
        </div>
        <div className="lg:col-span-2">
              <SalesHistoryChart 
            data={AllDashboard?.MonthlySalesHistory}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
