"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, LayoutDashboard } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Dashboard Modules
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

// Data & Loading
import { useGetAdminStatsQuery } from "@/redux/featured/Dashboards/DashboardsApi";
import DashboardSkeleton from "./DashboardSkeleton";

const AdminDashboard = () => {
  const [date, setDate] = React.useState<Date>();
  const { data: AllDashboard, isLoading } = useGetAdminStatsQuery();

  if (isLoading) return <DashboardSkeleton />;

  // Safely extract data with default fallbacks
  const salesData = AllDashboard?.SalesAndCostStats?.stats?.map((item: any) => ({
    day: item.day,
    sales: item.totalSales,
    cost: item.totalCost,
  })) || [];

  const growth = AllDashboard?.SalesAndCostStats?.totalSalesSum || 0;
  const days = AllDashboard?.SalesAndCostStats?.days || 0;

  // Formatting order card data
  const cardConfig: Array<{ type: "order"; props: OrderCardProps } | { type: "vendor" }> = [
    {
      type: "order",
      props: {
        title: "Total Orders",
        value: AllDashboard?.TotalOrdersStats?.totalOrders || 0,
        change: AllDashboard?.TotalOrdersStats?.percentChange || 0,
        chartData: [{ value: 10 }, { value: 15 }, { value: 8 }, { value: 20 }], // Use real data if available
      },
    },
    {
      type: "order",
      props: {
        title: "Total Profit",
        value: AllDashboard?.ProfitStats?.totalSales || 0,
        change: AllDashboard?.ProfitStats?.percentChange || 0,
        chartData: [{ value: 5 }, { value: 12 }, { value: 18 }, { value: 14 }], 
      },
    },
    { type: "vendor" },
  ];

  const shopStats = [
    { title: "Total Shops", count: AllDashboard?.TotalShopsStats?.totalShops, sub: AllDashboard?.TotalShopsStats?.comparedTo },
    { title: "Pending", count: AllDashboard?.PendingOrder?.totalOrders, sub: AllDashboard?.PendingOrder?.comparedTo },
    { title: "Processing", count: AllDashboard?.ProcessingOrder?.totalOrders, sub: AllDashboard?.ProcessingOrder?.comparedTo },
    { title: "Completed", count: AllDashboard?.CompletedOrder?.totalOrders, sub: AllDashboard?.CompletedOrder?.comparedTo },
    { title: "Cancelled", count: AllDashboard?.CancelledOrder?.totalOrders, sub: AllDashboard?.CancelledOrder?.comparedTo },
  ];

  return (
    <div className="min-h-screen space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Admin Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time performance and shop analytics.</p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-xl border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
              <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
              {date ? format(date, "PPP") : <span className="text-slate-600">Last 28 Days</span>}
              <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      {/* Primary Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SalesCostCard chartData={salesData} growth={growth} days={days} />
        </div>
        <div className="lg:col-span-4">
          <SessionCard userStats={AllDashboard?.UserStats} />
        </div>
      </div>

      {/* Order & Vendor High-Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardConfig.map((card, index) =>
          card.type === "order" ? (
            <OrderCard key={index} {...card.props} />
          ) : (
            <VendorCard
              key={index}
              comparedTo={AllDashboard?.TotalVendorsStats?.comparedTo || "Last 3 days"}
              totalVendors={AllDashboard?.TotalVendorsStats?.totalVendors || 0}
            />
          )
        )}
      </div>

      {/* Shop & Order Status Quick-Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {shopStats.map((stat, idx) => (
          <Link key={idx} href="/all-shop" className="transition-transform hover:-translate-y-1 active:scale-95">
            <ShopCard 
              title={stat.title} 
              subtitle={stat.sub || "Last 3 days"} 
              count={stat.count || 0} 
            />
          </Link>
        ))}
      </div>

      {/* Product Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <TopSellingProducts products={AllDashboard?.TopSellingProductsStats || []} />
        </div>
        <div className="lg:col-span-4">
          <TrendingProducts
            trendingProducts={AllDashboard?.TrendingProductsStats?.trendingProducts || []}
            comparedTo={AllDashboard?.TrendingProductsStats?.comparedTo || "Last 3 days"}
          />
        </div>
      </div>

      {/* Real-time Tracking & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <TodayOrderChart 
            totalOrders={AllDashboard?.TodayOrdersStats?.todayCount || 0} 
            percentageChange={AllDashboard?.TodayOrdersStats?.percentChange || 0} 
            chartData={AllDashboard?.TodayOrdersStats?.todayHourlyData?.map(item => ({
              time: item.hourLabel,
              value: item.count,
            })) || []} 
          />
        </div>
        <div className="lg:col-span-8">
          <RecentOrdersTable RecentOrders={transformRecentOrders(AllDashboard?.RecentOrders || [])} />
        </div>
      </div>

      {/* Financials & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <LastVendorPayoutTable />
        </div>
        <div className="lg:col-span-4">
          <TopSellingCategory />
        </div>
      </div>

      {/* Logistics & Long-term Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 h-[400px]">
          <Maps />
        </div>
        <div className="lg:col-span-8">
          <SalesHistoryChart data={AllDashboard?.MonthlySalesHistory} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;