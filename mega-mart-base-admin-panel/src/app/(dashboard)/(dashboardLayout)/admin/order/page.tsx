/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import {
  Search,
  ChevronDownIcon,
  Eye,
  EyeClosed,
  ExternalLinkIcon,
  Copy,
  Trash2,
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
  useDeleteOrderMutation,
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
  const {
    data: orderData,
    refetch,
    isLoading: ordersLoading,
  } = useGetAllOrdersQuery(queryParams);
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateOrderStatus, { isLoading: StatusChangeLoading }] = useUpdateStatsMutation();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("pending");
  const [currentPage, setCurrentPage] = useState(1);

  // --- NEW: state for delete confirmation ---
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
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

  // --- NEW: delete handler ---
  const handleDelete = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrder(orderToDelete).unwrap();
      refetch();
      toast.success("Order deleted!");
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error("Failed to delete order.");
    } finally {
      setOrderToDelete(null);
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

  if (ordersLoading) return <OrderPageSkeleton />;

  return (
    <>
      {/* ── Top bar ── */}
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

      {/* ── Table ── */}
      <div className="grow bg-white p-5 rounded-b-md shadow-sm mb-2.5">
        <div className="overflow-x-auto">
          <Table className="min-w-[750px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400 text-center">View</TableHead>
                <TableHead className="text-gray-400">PRODUCT</TableHead>
                <TableHead className="text-gray-400">ORDER ID</TableHead>
                <TableHead className="text-gray-400">CREATED</TableHead>
                <TableHead className="text-gray-400">CUSTOMER</TableHead>
                <TableHead className="text-gray-400">TOTAL</TableHead>
                <TableHead className="text-gray-400 text-center">STATUS</TableHead>
                <TableHead className="text-gray-400 text-center">ACTION</TableHead>
                {/* NEW column */}
                <TableHead className="text-gray-400 text-center">DELETE</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.isArray(orderData?.data) && orderData.data.length > 0 ? (
                orderData?.data?.map((item: Order) => (
                  <TableRow key={item._id}>
                    {/* View */}
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

                    {/* Product image */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            item?.orderInfo[0]?.productInfo?.featuredImg ||
                            "/placeholder.png"
                          }
                          alt="product"
                          className="w-10 h-10 object-cover rounded-md border"
                        />
                      </div>
                    </TableCell>

                    {/* Order ID */}
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>#{item._id.slice(-4).toUpperCase()}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item._id);
                            toast.success("Full Order ID copied!");
                          }}
                          className="text-gray-400 hover:text-black transition"
                          title="Copy full ID"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>

                    {/* Created */}
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Customer */}
                    <TableCell>{item?.customerInfo?.firstName} {item?.customerInfo?.lastName}</TableCell>

                    {/* Total */}
                    <TableCell>৳{item?.totalAmount}</TableCell>

                    {/* Status badge */}
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
                        {(item?.orderInfo[0]?.status || "Unknown")
                          .replace(/-/g, " ")
                          .toUpperCase()}
                      </span>
                    </TableCell>

                    {/* Action */}
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
                      )}
                    </TableCell>

                    {/* NEW: Delete cell */}
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs gap-1.5"
                        onClick={() => setOrderToDelete(item._id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-10 text-gray-500"
                  >
                    No orders found for &quot;{activeTab}&quot;
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

      {/* ── Order detail modal ── */}
      {expandedOrder && (
        <div
          onClick={() => setExpandedOrder(null)}
          className="bg-[#00000085] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-6 rounded-xl shadow-2xl w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto"
          >
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
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <h2 className="text-xl font-semibold text-center sm:text-left">
                      Order <span className="font-bold break-all">{rawOrder?._id}</span>
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(rawOrder?.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Customer + Shipping */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Customer */}
                    <div className="bg-[#F3F4F6] p-4 rounded-lg shadow-sm">
                      <h3 className="font-medium mb-2">Customer Information</h3>
                      <div className="text-sm space-y-1">
                        <p><span className="font-semibold">Name:</span> {rawOrder?.customerInfo?.firstName} {rawOrder?.customerInfo?.lastName}</p>
                        <p><span className="font-semibold">Email:</span> {rawOrder?.customerInfo?.email}</p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Phone:</span>
                          {rawOrder?.customerInfo?.phone}

                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(rawOrder?.customerInfo?.phone);
                              toast.success("Phone number copied!");
                            }}
                            className="text-gray-500 hover:text-black transition"
                            title="Copy phone number"
                          >
                            <Copy size={16} />
                          </button>
                        </p>
                        <p>
                          <span className="font-semibold">Address:</span>{" "}
                          {rawOrder?.customerInfo?.address}, {rawOrder?.customerInfo?.city},{" "}
                          {rawOrder?.customerInfo?.postalCode}, {rawOrder?.customerInfo?.country}
                        </p>
                      </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-[#F3F4F6] p-4 rounded-lg shadow-sm">
                      <h3 className="font-medium mb-2">Shipping & Payment</h3>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-semibold">Location:</span>{" "}
                          {rawOrder?.shipping?.shippingLocation === "dhaka"
                            ? "Dhaka"
                            : "Outside Dhaka"}
                        </p>
                        <p>
                          <span className="font-semibold">Shipping Cost:</span>{" "}
                          ৳{rawOrder?.shipping?.shippingCharge || 0}
                        </p>
                        <p>
                          <span className="font-semibold">Payment:</span>{" "}
                          {rawOrder?.paymentInfo === "cash-on"
                            ? "Cash on Delivery"
                            : "SSL Commerz"}
                        </p>

                        {/* Payment Status */}
                        <p>
                          <span className="font-semibold">Payment Status:</span>{" "}
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${rawOrder?.paymentStatus === "PAID"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {rawOrder?.paymentStatus || "UNPAID"}
                          </span>
                        </p>

                        {/* Track Button */}
                        {rawOrder?.trackingCode && (
                          <a
                            href={`https://steadfast.com.bd/t/${rawOrder?.trackingCode}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                          >
                            Track Order
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Coupon */}
                  {rawOrder?.coupon && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                      <h3 className="font-medium mb-2">🎟️ Coupon Applied</h3>
                      <p className="text-sm">
                        Code: <span className="font-mono">{rawOrder.coupon.code}</span>
                      </p>
                      <p className="text-green-600 text-sm">
                        -৳{rawOrder.coupon.discountAmount}
                      </p>
                    </div>
                  )}

                  {/* Summary */}
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
                          <span>Discount:</span>
                          <span>-৳{rawOrder.coupon.discountAmount}</span>
                        </div>
                      )}

                      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span>৳{rawOrder?.payableAmount || rawOrder?.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* ================= MOBILE CARD VIEW ================= */}
                  <div className="md:hidden space-y-4">
                    {rawOrder?.orderInfo?.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white p-4 rounded-lg shadow border">
                        <div className="flex gap-3">
                          <img
                            src={
                              item?.productInfo?.featuredImg ||
                              "https://via.placeholder.com/60"
                            }
                            className="w-16 h-16 rounded-md object-cover"
                          />

                          <div className="flex-1">
                            <h4 className="text-sm font-semibold line-clamp-2">
                              {item?.productInfo?.description?.name || "Product not found"}
                            </h4>
                            <p className="text-xs">Qty: {item?.quantity}</p>

                            <p
                              className={`text-xs capitalize ${item?.status === "confirmed"
                                ? "text-green-600"
                                : item?.status === "pending"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                                }`}
                            >
                              {item?.status}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between mt-2 text-xs">
                          <span>Tracking:</span>
                          <span>{item?.trackingNumber}</span>
                        </div>

                        <div className="flex justify-between mt-1 font-semibold">
                          <span>Total:</span>
                          <span>৳{item?.totalAmount?.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ================= DESKTOP TABLE ================= */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-[700px] bg-white border rounded-lg">
                      <thead>
                        <tr className="text-left bg-gray-100">
                          <th className="p-3">Product</th>
                          <th className="p-3">Tracking</th>
                          <th className="p-3">Qty</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Total</th>
                        </tr>
                      </thead>

                      <tbody>
                        {rawOrder?.orderInfo?.map((item: any, idx: number) => (
                          <tr key={idx} className="border-t">

                            {/* Product */}
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    item?.productInfo?.featuredImg ||
                                    "https://via.placeholder.com/50"
                                  }
                                  className="w-12 h-12 rounded object-cover border"
                                />

                                <div>
                                  <p className="text-sm font-medium line-clamp-1">
                                    {item?.productInfo?.description?.name || "Product not found"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ID: {item?.productInfo?._id?.slice(-5)}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Tracking */}
                            <td className="p-3 text-sm">{item?.trackingNumber}</td>

                            {/* Qty */}
                            <td className="p-3">{item?.quantity}</td>

                            {/* Status */}
                            <td className="p-3 capitalize">
                              <span
                                className={`px-2 py-1 rounded text-xs ${item?.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : item?.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                  }`}
                              >
                                {item?.status}
                              </span>
                            </td>

                            {/* Total */}
                            <td className="p-3 font-semibold">
                              ৳{item?.totalAmount?.total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── Courier modal ── */}
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

      {/* ── NEW: Delete confirmation modal ── */}
      {orderToDelete && (
        <div
          onClick={() => setOrderToDelete(null)}
          className="bg-[#00000085] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-7 rounded-xl shadow-2xl w-[90vw] max-w-sm text-center"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>

            <h3 className="text-base font-semibold mb-2 text-gray-800">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              This will permanently delete order{" "}
              <span className="font-semibold text-gray-700">
                #{orderToDelete.slice(-4).toUpperCase()}
              </span>
              . This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 px-5"
                onClick={() => setOrderToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white px-5"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPage;