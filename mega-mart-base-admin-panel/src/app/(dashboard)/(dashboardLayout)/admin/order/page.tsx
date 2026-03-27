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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaginationView from "@/components/Pagination";
import { ITagQueryParams } from "@/types/tags";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import OrderPageSkeleton from "@/components/pages/admin/OrderPageSkeleton";

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
  | "refunded";

const OrderPage = () => {
  const [queryParams, setQueryParams] = useState<ITagQueryParams>({
    limit: 8,
  });
  const [searchValue, setSearchValue] = useState("");
  const { data: orderData, refetch,isLoading : ordersLoading} = useGetAllOrdersQuery(queryParams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateOrderStatus, { isLoading: StatusChangeLoading }] =
    useUpdateStatsMutation();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("pending");
  const [currentPage, setCurrentPage] = useState(1);




  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus({
        id: orderId,
        status: { status: newStatus },
      }).unwrap();
      refetch();
      toast.success("Status Updated!");
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const statuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "picked",
    "at-local-facility",
    "out-for-delivery",
    "delivered",
    "cancelled",
    "returned",
    "refunded",
  ];

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      page: currentPage,
    }));
  }, [currentPage]);

  if (ordersLoading) return < OrderPageSkeleton/>

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pt-6">
        <div className="relative w-full sm:w-1/3 bg-white">
          <Input
            placeholder="Search by order id"
            value={queryParams.searchTerm}
            onChange={(e) =>
              setQueryParams((prev) => ({
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
          value={queryParams.type || ""}
          onValueChange={(value) => {
            setQueryParams((prev) => ({
              ...prev,
              status: value === "all" ? undefined : value,
            }));
            setActiveTab(value);
          }}
        >
          <SelectTrigger className="w-40 text-black">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {statuses.map((status) => (
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
                <TableHead className="text-gray-400 text-center">
                  View
                </TableHead>
                <TableHead className="text-gray-400">ORDER ID</TableHead>
                <TableHead className="text-gray-400">CREATED</TableHead>
                <TableHead className="text-gray-400">CUSTOMER</TableHead>
                <TableHead className="text-gray-400">TOTAL</TableHead>
                {/* REMOVED Profit Column */}
                <TableHead className="text-gray-400 text-center">
                  STATUS
                </TableHead>
                <TableHead className="text-gray-400 text-center">
                  Action
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(orderData?.data) && orderData.data.length > 0 ? (
                orderData?.data?.map((item: Order) => {
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
                          {expandedOrder === item._id ? <EyeClosed /> : <Eye />}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">{item._id}</TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{item?.customerInfo?.firstName}</TableCell>
                      {/* UPDATED: from item.total to item.totalAmount */}
                      <TableCell>৳{item?.totalAmount}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-md ${
                            item?.orderInfo[0]?.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : item?.orderInfo[0]?.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : item?.orderInfo[0]?.status === "processing"
                              ? "bg-purple-100 text-purple-800"
                              : item?.orderInfo[0]?.status === "picked"
                              ? "bg-indigo-100 text-indigo-800"
                              : item?.orderInfo[0]?.status ===
                                "at-local-facility"
                              ? "bg-sky-100 text-sky-800"
                              : item?.orderInfo[0]?.status ===
                                "out-for-delivery"
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
                          {(item?.orderInfo[0]?.status || "Unknown")
                            .replace(/-/g, " ")
                            .toUpperCase()}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        {item.orderInfo[0]?.status === "pending" ? (
                          <Button
                            onClick={() =>
                              handleStatusChange(item._id, "confirmed")
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200 min-w-[130px] text-center"
                          >
                            Confirm
                          </Button>
                        ) : item.orderInfo[0]?.status === "confirmed" ? (
                          <Button
                            onClick={() => {
                              setSelectedOrder(item);
                              setIsModalOpen(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200 min-w-[130px] text-center"
                          >
                            Send to Courier
                          </Button>
                        ) : (
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200 min-w-[130px] text-center border-gray-300 hover:bg-gray-100"
                                >
                                  Update Status
                                  <ChevronDownIcon
                                    className="-me-1 opacity-60 ml-1"
                                    size={16}
                                  />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent className="min-w-[180px]">
                                {statuses.map((status) => (
                                  <DropdownMenuItem
                                    key={status}
                                    onClick={() =>
                                      handleStatusChange(item._id, status)
                                    }
                                  >
                                    {status.replace(/-/g, " ")}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7} // Reduced colspan since profit is gone
                    className="text-center py-10 text-gray-500"
                  >
                    No orders found for "{activeTab}"
                    {searchValue && ` matching "${searchValue}"`}.
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
        <div
          onClick={() => setExpandedOrder(null)}
          className="bg-[#00000085] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-6 rounded-xl shadow-2xl w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <Button
              onClick={() => setExpandedOrder(null)}
              className="absolute top-3 bg-background right-3 text-gray-500 hover:text-gray-300"
            >
              ✕
            </Button>

            {(() => {
              const rawOrder = orderData?.data?.find(
                (o: any) => o._id === expandedOrder
              );
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
                          {rawOrder?.orderInfo?.map((item, idx) => (
                            <TableRow key={idx}>
                              {/* UPDATED: item.productInfo is now an object. Using its _id. */}
                              <TableCell>
                                {item?.productInfo?.productInfo._id}
                              </TableCell>
                              <TableCell>{item?.trackingNumber}</TableCell>
                              <TableCell>{item?.quantity}</TableCell>
                              <TableCell className="capitalize">
                                {item?.status}
                              </TableCell>
                              <TableCell>৳{item?.totalAmount?.total}</TableCell>
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
