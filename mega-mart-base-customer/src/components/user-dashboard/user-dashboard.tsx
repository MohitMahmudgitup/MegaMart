"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Heart,
  CreditCard,
  MapPin,
  Package,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { useGetDashboardQuery } from "@/redux/featured/dashboard/dashboardApi";
import { useGetMyOrdersQuery } from "@/redux/featured/order/orderApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCustomer } from "@/redux/featured/customer/customerSlice";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useGetSingleCustomerQuery } from "@/redux/featured/customer/customerApi";
import Loading from "./loading";

export default function Dashboard() {
  const { data, isLoading, isError, error } = useGetDashboardQuery();
  const customerDetails = useAppSelector(selectCustomer);
  const {
    data: orders
  } = useGetMyOrdersQuery({ id: customerDetails?._id as string }, {
    skip: !customerDetails?._id,
  });


  const currentUser = useAppSelector(selectCurrentUser);
  const {
    data: Customer,
  } = useGetSingleCustomerQuery(currentUser?._id as string);
  // Console log the fetched data


  if (isLoading) return <Loading />
  if (isError)
    return (
      <p className="p-6 text-sm text-red-600">Error: {JSON.stringify(error)}</p>
    );

  return (
    <div className="min-h-screen ">
      <div className="w-full">
        {/* Header */}
        <div className="p-6 rounded-t-lg border border-gray-200 bg-linear-to-r from-orange-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Track and manage your orders</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 mt-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-2xl text-gray-900">
                  {orders?.meta?.total || 0}
                </p>

                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </CardContent>
          </Card>

          {/* Wishlist Items */}
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-2xl text-gray-900">
                  {Customer?.wishlist?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Wishlist Items</p>
              </div>
            </CardContent>
          </Card>

          {/* Saved Cards */}
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl text-gray-900">
                  {data[0]?.savedCards ?? 0}
                </p>
                <p className="text-sm text-gray-600">Saved Cards</p>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl text-gray-900">
                  {Customer?.address?.length ||
                    0}
                </p>
                <p className="text-sm text-gray-600">Addresses</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <Link href="/dashboard/orders" className="block">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <span className="flex items-center gap-3">
                    <Package className="text-blue-500" />
                    View Orders
                  </span>
                </div>
              </Link>

              <Link href="/dashboard/wishlistItems" className="block">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <span className="flex items-center gap-3">
                    <Heart className="text-pink-500" />
                    Manage Wishlist
                  </span>
                </div>
              </Link>

              <Link href="/dashboard/profile" className="block">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <span className="flex items-center gap-3">
                    <CreditCard className="text-orange-500" />
                    Update Profile
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Recent Orders
            </h2>

            {data?.[0]?.recentOrders?.length ? (
              <div className="divide-y">
                {data[0].recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-4 hover:bg-gray-50 px-3 rounded-lg transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        #{order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${order.totalAmount}
                      </p>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium
                        ${order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }
                      `}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No recent orders found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
