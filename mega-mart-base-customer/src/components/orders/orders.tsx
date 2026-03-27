"use client";

import PaginationView from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { selectCustomer } from "@/redux/featured/customer/customerSlice";
import {
  useCancelOrderMutation,
  useGetMyOrdersQuery,
} from "@/redux/featured/order/orderApi";
import { useRetryPaymentMutation } from "@/redux/featured/payment/paymentApi";
import { useAppSelector } from "@/redux/hooks";
import { IQueryParams } from "@/types/query";
import {
  Eye,
  ExternalLinkIcon,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Cross,
  ClosedCaption,
  Triangle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";


export default function MyOrdersTable() {
  const parama = useSearchParams();
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    limit: 8,
  });
  const customerDetails = useAppSelector(selectCustomer);
  const [cancelOrderApi] = useCancelOrderMutation();
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyOrdersQuery({ id: customerDetails?._id as string , params: queryParams}, {
    skip: !customerDetails?._id,
  });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [reTryPayment] = useRetryPaymentMutation()
  const [currentPage, setCurrentPage] = useState(1);

  const hasShownToast = useRef(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    message: string;
    transactionId: string | null;
  } | null>(null);

  useEffect(() => {
    if (hasShownToast.current) return;

    const status = parama.get("status");
    const message = parama.get("message");
    const txnId = parama.get("transactionId");

    if (status === "success") {
      setPaymentDetails({
        message: message || "Your payment has been processed successfully!",
        transactionId: txnId,
      });
      setShowSuccessModal(true);
      if (txnId) {
        setTransactionId(txnId);
      }
      hasShownToast.current = true;
      refetch(); // Refresh orders after successful payment
    } else if (
      status === "fail" ||
      status === "failed" ||
      status === "cancel"
    ) {
      toast.error(
        message || "Payment was unsuccessful. Please try again or contact support.",
        {
          duration: 5000,
          icon: '❌',
        }
      );
      hasShownToast.current = true;
    }
  }, [parama, refetch]);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const cancelOrder = async (id: string) => {
    try {
      await cancelOrderApi(id).unwrap();
      refetch();
      setIsModalOpen(false);
      toast.success("Order cancelled successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Unable to cancel order. Please contact customer support for assistance.", {
        duration: 5000,
        icon: '⚠️',
      });
    }
  };


  useEffect(() => {
    setQueryParams(prev => ({
      ...prev,
      page: currentPage,
    }));
  }, [currentPage]);


  const retryPayment = async (paymentId: string) => {
    setIsPaymentStart(true)
   try {
     const paymentResponse = await reTryPayment(paymentId.toString()).unwrap();

     toast.success('Redirecting to payment gateway...')
     window.location.href = paymentResponse.data;
     setIsPaymentStart(false)
   } catch (error) {
    console.log(error,paymentId);
    
   }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Unable to load orders</p>
          <p className="text-gray-600 text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="w-full ">
        <div className="bg-white w-full max-w-6xl mx-auto rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
                <p className="text-sm text-gray-600">Track and manage your orders</p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {orders?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Package className="w-20 h-20 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 text-center mb-6">Start shopping to see your orders here</p>
              <Link href="/">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <div className="px-6 py-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders?.data?.map((order: any) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${order?.orderInfo[0]?.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order?.orderInfo[0]?.status === "confirmed"
                                  ? "bg-blue-100 text-blue-800"
                                  : order?.orderInfo[0]?.status === "processing"
                                    ? "bg-purple-100 text-purple-800"
                                    : order?.orderInfo[0]?.status === "picked"
                                      ? "bg-indigo-100 text-indigo-800"
                                      : order?.orderInfo[0]?.status === "at-local-facility"
                                        ? "bg-sky-100 text-sky-800"
                                        : order?.orderInfo[0]?.status === "out-for-delivery"
                                          ? "bg-cyan-100 text-cyan-800"
                                          : order?.orderInfo[0]?.status === "delivered"
                                            ? "bg-green-100 text-green-800"
                                            : order?.orderInfo[0]?.status === "cancelled"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {order?.orderInfo[0]?.status === "delivered" && <CheckCircle2 className="w-3 h-3" />}
                            {order?.orderInfo[0]?.status === "cancelled" && <XCircle className="w-3 h-3" />}
                            {order?.orderInfo[0]?.status === "pending" && <Clock className="w-3 h-3" />}
                            {(order?.orderInfo[0]?.status === "out-for-delivery" || order?.orderInfo[0]?.status === "at-local-facility") && <Truck className="w-3 h-3" />}
                            {(order?.orderInfo[0]?.status || "Unknown")
                              .replace(/-/g, " ")
                              .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${order?.paymentStatus === "PAID"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                              }`}
                          >
                            {order?.paymentStatus === "PAID" ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Paid
                              </>
                            ) : order?.paymentStatus === "UNPAID" ? (
                              <>
                                <ClosedCaption className="w-3 h-3" />
                                  UNPAID
                              </>
                            )  : (
                              <>
                                <Clock className="w-3 h-3" />
                                Pending
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              ৳{order?.payableAmount 
                                ? order.payableAmount.toFixed(2)
                                : (order.totalAmount + (order?.shipping?.shippingCharge || 0)).toFixed(2)
                              }
                            </div>
                            {order?.coupon && order.coupon.discountAmount > 0 && (
                              <span className="text-xs text-green-600 font-medium">
                                Saved ৳{order.coupon.discountAmount.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4 text-gray-400" />
                            {order.orderInfo?.length || 0} item{order.orderInfo?.length !== 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:border-orange-300"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              {paymentDetails?.message}
            </p>

            {paymentDetails?.transactionId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                <p className="text-sm font-mono font-semibold text-gray-900">
                  {paymentDetails.transactionId}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Close
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                      Order #{selectedOrder._id.slice(-8).toUpperCase()}
                    </DialogTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full ${selectedOrder?.orderInfo[0]?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedOrder?.orderInfo[0]?.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : selectedOrder?.orderInfo[0]?.status === "processing"
                              ? "bg-purple-100 text-purple-800"
                              : selectedOrder?.orderInfo[0]?.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : selectedOrder?.orderInfo[0]?.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {selectedOrder?.orderInfo[0]?.status === "delivered" && <CheckCircle2 className="w-4 h-4" />}
                      {selectedOrder?.orderInfo[0]?.status === "cancelled" && <XCircle className="w-4 h-4" />}
                      {(selectedOrder?.orderInfo[0]?.status || "Unknown")
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                    {/* Payment Status Badge */}
                    {selectedOrder?.paymentStatus === "PAID" && (
                      <>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${selectedOrder?.paymentStatus === "PAID"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Payment Completed
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Payment Information */}
                {selectedOrder?.paymentStatus === "PAID" ? (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Payment Confirmed</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Payment Method</span>
                        <span className="font-medium text-gray-900 capitalize">
                          {selectedOrder?.paymentInfo === "cash-on"
                            ? "Cash on Delivery"
                            : selectedOrder?.paymentInfo === "pay-with-sslCommerz"
                              ? "SSL Commerz"
                              : "Online Payment"}
                        </span>
                      </div>
                      {selectedOrder?.paymentId?.transactionId && (
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-700">Transaction ID</span>
                          <span className="font-mono text-xs font-medium text-gray-900 bg-white px-3 py-2 rounded border border-emerald-200 break-all">
                            {selectedOrder.paymentId.transactionId}
                          </span>
                        </div>
                      )}
                      {selectedOrder?.paymentId?.amount && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Amount Paid</span>
                          <span className="font-semibold text-gray-900">
                            ${selectedOrder.paymentId.amount}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Payment Date</span>
                        <span className="font-medium text-gray-900">
                          {selectedOrder?.paymentId?.createdAt
                            ? new Date(selectedOrder.paymentId.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                            : new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          }
                        </span>
                      </div>
                      {selectedOrder?.paymentId?.orderId && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Payment Order ID</span>
                          <span className="font-mono text-xs font-medium text-gray-900">
                            #{selectedOrder.paymentId.orderId}
                          </span>
                        </div>
                      )}
                      <div className="pt-2 mt-2 border-t border-emerald-200">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="font-medium">Your payment has been successfully processed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) :
                  selectedOrder?.paymentStatus === "UNPAID" && selectedOrder.paymentInfo !== 'cash-on' ? 
                    (
                      <div className="bg-gradient-to-r from-rose-200 to-rose-300 rounded-lg p-4 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-rose-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900">Payment Failed</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Payment Method</span>
                            <span className="font-medium text-gray-900 capitalize">
                              {selectedOrder?.paymentInfo === "cash-on"
                                ? "Cash on Delivery"
                                : selectedOrder?.paymentInfo === "pay-with-sslCommerz"
                                  ? "SSL Commerz"
                                  : "Online Payment"}
                            </span>
                          </div>
                          {selectedOrder?.paymentId?.transactionId && (
                            <div className="flex flex-col gap-1">
                              <span className="text-gray-700">Transaction ID</span>
                              <span className="font-mono text-xs font-medium text-gray-900 bg-white px-3 py-2 rounded border border-emerald-200 break-all">
                                {selectedOrder.paymentId.transactionId}
                              </span>
                            </div>
                          )}
                          {selectedOrder?.paymentId?.amount && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">Amount UnPaid</span>
                              <span className="font-semibold text-gray-900">
                                ${selectedOrder.paymentId.amount}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Payment Fail Date</span>
                            <span className="font-medium text-gray-900">
                              {selectedOrder?.paymentId?.createdAt
                                ? new Date(selectedOrder.paymentId.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                                : new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              }
                            </span>
                          </div>
                          {selectedOrder?.paymentId?.orderId && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">Payment Order ID</span>
                              <span className="font-mono text-xs font-medium text-gray-900">
                                #{selectedOrder.paymentId.orderId}
                              </span>
                            </div>
                          )}
                          <div className="pt-2 mt-2 border-t border-emerald-200">
                            <div className="flex items-center gap-2 text-rose-700">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="font-medium">Your payment has been successfully processed</span>
                              <Button
                                onClick={() => retryPayment(selectedOrder?.paymentId?._id)}
                                disabled={!selectedOrder?.paymentId?._id || isPaymentStart}
                                className="h-12 flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                              >
                                {isPaymentStart ? (
                                  <>
                                    <Triangle className="w-5 h-5 animate-ping" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Triangle className="w-5 h-5" />
                                    Retry Payment
                                  </>
                                )}
                              </Button>

                            </div>
                          </div>
                        </div>
                      </div>
                    ):
                  (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Payment Status</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Payment Method</span>
                        <span className="font-medium text-gray-900 capitalize">
                          {selectedOrder?.paymentInfo === "cash-on"
                            ? "Cash on Delivery"
                            : selectedOrder?.paymentInfo === "pay-with-sslCommerz"
                              ? "SSL Commerz"
                              : "Online Payment"}
                        </span>
                      </div>
                      {selectedOrder?.paymentInfo === "cash-on" ? (
                        <div className="pt-2 mt-2 border-t border-amber-200">
                          <div className="flex items-start gap-2 text-amber-700">
                            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">
                              Please keep the exact amount ready. Payment will be collected upon delivery.
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 mt-2 border-t border-amber-200">
                          <div className="flex items-start gap-2 text-amber-700">
                            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">
                              Awaiting payment confirmation. This may take a few minutes.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Coupon Information (if applied) */}
                {selectedOrder?.coupon && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Coupon Applied</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Coupon Code</span>
                        <span className="font-mono font-bold text-orange-900 bg-white px-3 py-1 rounded border border-orange-300">
                          {selectedOrder.coupon.code}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Discount Amount</span>
                        <span className="font-semibold text-green-700">
                          -৳{selectedOrder.coupon.discountAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-orange-200">
                        <div className="flex items-center gap-2 text-orange-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="font-medium">Discount successfully applied to your order</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-medium">
                      {selectedOrder.customerInfo?.firstName} {selectedOrder.customerInfo?.lastName}
                    </p>
                    <p>{selectedOrder.customerInfo?.address}</p>
                    <p>
                      {selectedOrder.customerInfo?.city}, {selectedOrder.customerInfo?.postalCode}
                    </p>
                    <p>{selectedOrder.customerInfo?.country}</p>
                    <p className="pt-2">Phone: {selectedOrder.customerInfo?.phone}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {(selectedOrder.orderInfo || []).map((item: any) => (
                      <div
                        key={item._id || Math.random()}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.productInfo?.featuredImg || "/placeholder.svg"}
                            alt={item.productInfo?.description?.name || "Product"}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {item.productInfo?.description?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Quantity: {item.quantity || 1}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ${item.totalAmount?.subTotal || "0.00"}
                          </div>
                          <div className="text-xs text-gray-500">
                            ${(item.totalAmount?.subTotal / item.quantity).toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">৳{selectedOrder.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">৳{selectedOrder?.shipping?.shippingCharge || 0}</span>
                    </div>
                    
                    {/* Coupon Discount */}
                    {selectedOrder?.coupon && selectedOrder.coupon.discountAmount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          Discount
                          <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">
                            {selectedOrder.coupon.code}
                          </span>
                        </span>
                        <span className="text-green-600 font-semibold">-৳{selectedOrder.coupon.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-base">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">
                          ৳{selectedOrder?.payableAmount 
                            ? selectedOrder.payableAmount.toFixed(2)
                            : (selectedOrder.totalAmount + (selectedOrder?.shipping?.shippingCharge || 0)).toFixed(2)
                          }
                        </span>
                      </div>
                      {selectedOrder?.coupon && selectedOrder.coupon.discountAmount > 0 && (
                        <p className="text-xs text-green-600 mt-1 font-medium">
                          You saved ৳{selectedOrder.coupon.discountAmount.toFixed(2)} with this coupon!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  {selectedOrder.orderInfo?.[0]?.status === "pending" && (
                    <Button
                      onClick={() => cancelOrder(selectedOrder._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Order
                    </Button>
                  )}
                  {selectedOrder?.trackingCode && (
                    <Button
                      asChild
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Link
                        href={`https://steadfast.com.bd/t/${selectedOrder?.trackingCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        Track Order
                        <ExternalLinkIcon className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <PaginationView
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        meta={orders?.meta}
      />
    </>
  );
}
