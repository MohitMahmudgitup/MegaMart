/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Search,
  ChevronDownIcon,
  Eye,
  EyeClosed,
  ExternalLinkIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useGetAllOrdersQuery,
  useUpdateStatsMutation,
} from "@/redux/featured/order/orderApi";
import { Order } from "@/types/Order";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import SendtoSteadFastCourierModal from "@/components/order/SendtoSteadFastCourierModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PaginationView from "@/components/Pagination";
import { ITagQueryParams } from "@/types/tags";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useGetVendorByUserIdQuery } from "@/redux/featured/vendor/vendorApi";



export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "picked"
  | "at-local-facility"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded"



const OrderPage = () => {
  const currentUser: any = useAppSelector(selectCurrentUser);
  const userId = currentUser?._id;

  const { data: vendor, isLoading: vendorLoading } = useGetVendorByUserIdQuery(userId!, {
    skip: !userId,
  });

  const [queryParams, setQueryParams] = useState<ITagQueryParams>({
    limit: 8,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string | null>("pending");

  const { data: orderData, isLoading: ordersLoading, refetch } = useGetAllOrdersQuery(
    { ...queryParams, vendorOrderId: vendor?._id },
    { skip: !vendor?._id }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orderData?.data?.filter((order: any) =>
    order.orderInfo?.some((info: any) => info.vendorId === vendor?._id)
  ) || [];

  const statuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'picked',
    'at-local-facility',
    'out-for-delivery',
    'delivered',
    'cancelled',
    'returned',
    'refunded',
  ];

  useEffect(() => {
    setQueryParams(prev => ({
      ...prev,
      page: currentPage,
    }));
  }, [currentPage]);

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">User not found. Please login again.</p>
      </div>
    );
  }

  if (vendorLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading vendor information...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Vendor information not found!</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pt-6">
        <div className="relative w-full sm:w-1/3 bg-white">
          <Input
            placeholder="Search by order id"
            value={queryParams.searchTerm}
            onChange={e =>
              setQueryParams(prev => ({
                ...prev,
                searchTerm: e.target.value,
              }))
            }
            className="pl-10"
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
          />
        </div>
        <Select
          value={queryParams.type || ''}
          onValueChange={(value) => {
            setQueryParams((prev) => ({
              ...prev,
              status: value === 'all' ? undefined : value,
            }));
            setActiveTab(value);
          }}
        >
          <SelectTrigger className="w-40 text-black">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>



      <div className="grow bg-white p-5 rounded-b-md shadow-sm mb-2.5">
        <div className="overflow-x-auto">
          <Table className="min-w-[678px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400 text-center">View</TableHead>
                <TableHead className="text-gray-400">ORDER ID</TableHead>
                <TableHead className="text-gray-400">CREATED</TableHead>
                <TableHead className="text-gray-400">CUSTOMER</TableHead>
                <TableHead className="text-gray-400">TOTAL</TableHead>
                <TableHead className="text-gray-400 text-center">STATUS</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <span className="ml-3 text-gray-500">Loading orders...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
                filteredOrders?.map((item: Order) => {
                  return (
                    <TableRow key={item._id}>
                      <TableCell className="text-center">
                        <button
                          className="rounded-full border p-1 text-gray-500"
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === item._id ? null : item._id
                            )
                          }
                        >
                          {expandedOrder === item._id ? (
                            <EyeClosed />
                          ) : (
                            <Eye />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium text-xs">{item._id}</TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{item?.customerInfo?.firstName || "N/A"}</TableCell>
                      <TableCell>৳{item?.totalAmount || 0}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-md ${item?.orderInfo[0]?.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item?.orderInfo[0]?.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : item?.orderInfo[0]?.status === "processing"
                                ? "bg-purple-100 text-purple-800"
                                : item?.orderInfo[0]?.status === "picked"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : item?.orderInfo[0]?.status === "at-local-facility"
                                    ? "bg-sky-100 text-sky-800"
                                    : item?.orderInfo[0]?.status === "out-for-delivery"
                                      ? "bg-cyan-100 text-cyan-800"
                                      : item?.orderInfo[0]?.status === "delivered"
                                        ? "bg-green-100 text-green-800"
                                        : item?.orderInfo[0]?.status === "cancelled"
                                          ? "bg-red-100 text-red-800"
                                          : item?.orderInfo[0]?.status === "returned"
                                            ? "bg-orange-100 text-orange-800"
                                            : item?.orderInfo[0]?.status === "refunded"
                                              ? "bg-pink-100 text-pink-800"
                                              : item?.orderInfo[0]?.status === "completed"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {(item?.orderInfo[0]?.status || "Unknown").replace(/-/g, " ").toUpperCase()}
                        </span>

                      </TableCell>


                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-gray-500"
                  >
                    {activeTab ? `No orders found with status "${activeTab}"` : "No orders found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationView
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          meta={orderData?.meta}
        />
      </div>

      {/* MODAL */}
      {expandedOrder && (
        <div onClick={() => setExpandedOrder(null)} className="bg-[#00000085] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-50">
          <div onClick={(e) => e.stopPropagation()} className="relative bg-white p-6 rounded-xl shadow-2xl w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <Button
              onClick={() => setExpandedOrder(null)}
              className="absolute top-3 bg-background right-3 text-gray-500 hover:text-gray-300"
            >
              ✕
            </Button>

            {(() => {
              const rawOrder = orderData?.data?.find((o: any) => o._id === expandedOrder);
              if (!rawOrder) return <p>Order not found.</p>;

              return (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Order <span className="font-bold">{rawOrder?._id}</span>
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(rawOrder?.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Customer + Payment + Shipping */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer Info */}
                    <div className="bg-[#F3F4F6] p-4 rounded-lg shadow-sm">
                      <h3 className="font-medium mb-2">Customer Information</h3>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {rawOrder?.customerInfo?.firstName}{" "}
                          {rawOrder?.customerInfo?.lastName}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {rawOrder?.customerInfo?.email}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {rawOrder?.customerInfo?.phone}
                        </p>
                        <p>
                          <span className="font-semibold">Address:</span>{" "}
                          {rawOrder?.customerInfo?.address},{" "}
                          {rawOrder?.customerInfo?.city},{" "}
                          {rawOrder?.customerInfo?.postalCode},{" "}
                          {rawOrder?.customerInfo?.country}
                        </p>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-[#F3F4F6] p-4 rounded-lg shadow-sm">
                      <h3 className="font-medium mb-2">Shipping & Payment</h3>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-semibold">Location:</span>{" "}
                          {rawOrder?.shipping?.shippingLocation === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'}
                        </p>
                        <p>
                          <span className="font-semibold">Shipping Cost:</span> ৳
                          {rawOrder?.shipping?.shippingCharge || 0}
                        </p>
                        <p>
                          <span className="font-semibold">Payment:</span>{" "}
                          {rawOrder?.paymentInfo === 'cash-on' ? 'Cash on Delivery' : 'SSL Commerz'}
                        </p>
                        <p>
                          <span className="font-semibold">Payment Status:</span>{" "}
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            rawOrder?.paymentStatus === 'PAID' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {rawOrder?.paymentStatus || 'UNPAID'}
                          </span>
                        </p>
                        {rawOrder?.trackingCode && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="mt-2 bg-green-400 hover:bg-green-500"
                          >
                            <Link
                              href={`https://steadfast.com.bd/t/${rawOrder?.trackingCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              Track Order
                              <ExternalLinkIcon className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Coupon Info (if applied) */}
                  {rawOrder?.coupon && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg shadow-sm border border-orange-200">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <span className="text-orange-600">🎟️</span> Coupon Applied
                      </h3>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-semibold">Code:</span>{" "}
                          <span className="font-mono bg-white px-2 py-1 rounded border border-orange-300">
                            {rawOrder.coupon.code}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold">Discount:</span>{" "}
                          <span className="text-green-600 font-semibold">
                            -৳{rawOrder.coupon.discountAmount}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="bg-[#F3F4F6] p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium mb-2">Order Summary</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>৳{rawOrder?.totalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>৳{rawOrder?.shipping?.shippingCharge || 0}</span>
                      </div>
                      {rawOrder?.coupon && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({rawOrder.coupon.code}):</span>
                          <span>-৳{rawOrder.coupon.discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span>৳{rawOrder?.payableAmount || rawOrder?.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-[#F3F4F6] p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px] bg-white">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Tracking</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rawOrder?.orderInfo?.map((item: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="text-xs">
                                {item?.productInfo?.productInfo?._id || item?.productInfo?._id || "N/A"}
                              </TableCell>
                              <TableCell>{item?.trackingNumber || "N/A"}</TableCell>
                              <TableCell>{item?.quantity || 0}</TableCell>
                              <TableCell className="capitalize">{item?.status || "pending"}</TableCell>
                              <TableCell>৳{item?.totalAmount?.total || item?.totalAmount || 0}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {selectedOrder && (
        <SendtoSteadFastCourierModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          initialData={selectedOrder}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default OrderPage;