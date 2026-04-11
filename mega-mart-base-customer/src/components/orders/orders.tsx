"use client";

import PaginationView from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { selectCustomer } from "@/redux/featured/customer/customerSlice";
import {
  useCancelOrderMutation,
  useGetMyOrdersQuery,
} from "@/redux/featured/order/orderApi";
import { useRetryPaymentMutation } from "@/redux/featured/payment/paymentApi";
import { useAppSelector } from "@/redux/hooks";
import { IQueryParams } from "@/types/query";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  MapPin,
  Calendar,
  Package,
  ShoppingBag,
  ExternalLink,
  RotateCcw,
  ChevronRight,
  X,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";

/* ─── helpers ─────────────────────────────────────────────── */

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtAmt(n: number) {
  return "৳" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "picked"
  | "at-local-facility"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-800",
    icon: <Clock className="w-3 h-3" />,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  processing: {
    label: "Processing",
    color: "bg-purple-100 text-purple-800",
    icon: <Package className="w-3 h-3" />,
  },
  picked: {
    label: "Picked",
    color: "bg-indigo-100 text-indigo-800",
    icon: <Package className="w-3 h-3" />,
  },
  "at-local-facility": {
    label: "At Facility",
    color: "bg-sky-100 text-sky-800",
    icon: <Truck className="w-3 h-3" />,
  },
  "out-for-delivery": {
    label: "Out for Delivery",
    color: "bg-cyan-100 text-cyan-800",
    icon: <Truck className="w-3 h-3" />,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-800",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="w-3 h-3" />,
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as OrderStatus] ?? {
    label: status.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    color: "bg-gray-100 text-gray-700",
    icon: null,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${cfg.color}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function PayBadge({
  status,
  info,
}: {
  status: string;
  info: string;
}) {
  if (status === "PAID")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="w-3 h-3" /> Paid
      </span>
    );
  if (info === "cash-on")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
        <Clock className="w-3 h-3" /> Cash on Delivery
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
      <XCircle className="w-3 h-3" /> Unpaid
    </span>
  );
}

/* ─── drawer ──────────────────────────────────────────────── */

function OrderDrawer({
  order,
  onClose,
  onCancel,
  onRetry,
  isRetrying,
}: {
  order: any;
  onClose: () => void;
  onCancel: (id: string) => void;
  onRetry: (paymentId: string) => void;
  isRetrying: boolean;
}) {
  const status: OrderStatus = order?.orderInfo[0]?.status;
  const isPaid = order?.paymentStatus === "PAID";
  const isUnpaid =
    order?.paymentStatus === "UNPAID" && order?.paymentInfo !== "cash-on";
  const isCOD = order?.paymentInfo === "cash-on";
  const canCancel = status === "pending";
  const canTrack = !!order?.trackingCode;

  const subtotal = order?.totalAmount ?? 0;
  const shipping = order?.shipping?.shippingCharge ?? 0;
  const discount = order?.coupon?.discountAmount ?? 0;
  const total =
    order?.payableAmount ?? subtotal + shipping;

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* sheet */}
      <div className="relative w-full max-w-2xl bg-white rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto animate-slide-up">
        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              #{order._id.slice(-8).toUpperCase()}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {fmtDate(order.createdAt)}
              </span>
              <StatusBadge status={status} />
              <PayBadge status={order.paymentStatus} info={order.paymentInfo} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* ── payment info ── */}
          {isPaid && (
            <section className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-2.5">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Payment confirmed
                </h3>
              </div>
              <Row
                label="Method"
                value={
                  order.paymentInfo === "cash-on"
                    ? "Cash on Delivery"
                    : order.paymentInfo === "pay-with-sslCommerz"
                    ? "SSL Commerz"
                    : "Online Payment"
                }
              />
              {order?.paymentId?.transactionId && (
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono text-xs bg-white px-3 py-2 rounded-lg border border-emerald-200 text-gray-800 break-all">
                    {order.paymentId.transactionId}
                  </span>
                </div>
              )}
              {order?.paymentId?.amount && (
                <Row
                  label="Amount paid"
                  value={fmtAmt(order.paymentId.amount)}
                />
              )}
              {order?.paymentId?.createdAt && (
                <Row
                  label="Payment date"
                  value={new Date(order.paymentId.createdAt).toLocaleString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                />
              )}
            </section>
          )}

          {isUnpaid && (
            <section className="rounded-xl bg-red-50 border border-red-200 p-4 space-y-2.5">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-600" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Payment failed
                </h3>
              </div>
              <Row
                label="Method"
                value={
                  order.paymentInfo === "pay-with-sslCommerz"
                    ? "SSL Commerz"
                    : "Online Payment"
                }
              />
              {order?.paymentId?._id && (
                <Button
                  onClick={() => onRetry(order.paymentId._id)}
                  disabled={isRetrying}
                  size="sm"
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                  <RotateCcw
                    className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
                  />
                  {isRetrying ? "Processing…" : "Retry payment"}
                </Button>
              )}
            </section>
          )}

          {!isPaid && !isUnpaid && (
            <section className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-2.5">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Payment pending
                </h3>
              </div>
              <Row
                label="Method"
                value={isCOD ? "Cash on Delivery" : "Online Payment"}
              />
              <p className="text-xs text-amber-700">
                {isCOD
                  ? "Please keep the exact amount ready. Payment will be collected upon delivery."
                  : "Awaiting payment confirmation. This may take a few minutes."}
              </p>
            </section>
          )}

          {/* ── coupon ── */}
          {order?.coupon && order.coupon.discountAmount > 0 && (
            <section className="rounded-xl bg-orange-50 border border-orange-200 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 text-orange-600" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Coupon applied
                </h3>
              </div>
              <Row
                label="Code"
                value={
                  <span className="font-mono font-bold text-orange-900 bg-white px-2.5 py-0.5 rounded border border-orange-300 text-xs">
                    {order.coupon.code}
                  </span>
                }
              />
              <Row
                label="Discount"
                value={
                  <span className="text-emerald-700 font-semibold">
                    -{fmtAmt(order.coupon.discountAmount)}
                  </span>
                }
              />
            </section>
          )}

          {/* ── items ── */}
          <section>
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-orange-500" />
              Order items
            </h3>
            <div className="space-y-2.5">
              {(order.orderInfo || []).map((item: any) => (
                <div
                  key={item._id ?? Math.random()}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="w-14 h-14 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image
                      src={
                        item.productInfo?.featuredImg ?? "/placeholder.svg"
                      }
                      alt={item.productInfo?.description?.name ?? "Product"}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {item.productInfo?.description?.name ?? "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Qty: {item.quantity ?? 1}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      ৳{item.totalAmount?.subTotal?.toFixed(2) ?? "0.00"}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-400">
                        ৳
                        {(
                          item.totalAmount?.subTotal / item.quantity
                        ).toFixed(2)}{" "}
                        each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── summary ── */}
          <section className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              Order summary
            </h3>
            <Row label="Subtotal" value={fmtAmt(subtotal)} />
            <Row
              label="Shipping"
              value={shipping === 0 ? "Free" : fmtAmt(shipping)}
            />
            {discount > 0 && (
              <Row
                label={
                  <span className="flex items-center gap-1">
                    Discount
                    {order.coupon?.code && (
                      <span className="text-xs text-orange-600 font-medium bg-orange-50 px-1.5 py-0.5 rounded">
                        {order.coupon.code}
                      </span>
                    )}
                  </span>
                }
                value={
                  <span className="text-emerald-600 font-semibold">
                    -{fmtAmt(discount)}
                  </span>
                }
              />
            )}
            <div className="border-t border-gray-200 pt-3 mt-1 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900 text-base">
                {fmtAmt(total)}
              </span>
            </div>
            {discount > 0 && (
              <p className="text-xs text-emerald-600 font-medium">
                You saved {fmtAmt(discount)} with this order! 🎉
              </p>
            )}
          </section>

          {/* ── shipping address ── */}
          <section className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-orange-500" />
              Delivery address
            </h3>
            <p className="font-medium text-gray-900 text-sm">
              {order.customerInfo?.firstName} {order.customerInfo?.lastName}
            </p>
            <p className="text-sm text-gray-600">
              {order.customerInfo?.address}
            </p>
            <p className="text-sm text-gray-600">
              {order.customerInfo?.city}, {order.customerInfo?.postalCode}
            </p>
            <p className="text-sm text-gray-600">
              {order.customerInfo?.country}
            </p>
            <p className="text-sm text-gray-500 pt-1">
              📞 {order.customerInfo?.phone}
            </p>
          </section>

          {/* ── actions ── */}
          <div className="flex gap-3 pb-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            {canCancel && (
              <Button
                onClick={() => onCancel(order._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel order
              </Button>
            )}
           
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.28s cubic-bezier(0.32, 0.72, 0, 1) both;
        }
      `}</style>
    </div>
  );
}

/* tiny helper row */
function Row({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}

/* ─── order card ──────────────────────────────────────────── */

function OrderCard({
  order,
  onClick,
}: {
  order: any;
  onClick: () => void;
}) {
  const status: OrderStatus = order?.orderInfo[0]?.status;
  const items: any[] = order?.orderInfo ?? [];
  const previewItems = items.slice(0, 3);
  const extraCount = items.length - previewItems.length;
  const total =
    order?.payableAmount ??
    order?.totalAmount + (order?.shipping?.shippingCharge ?? 0);

  return (
    <div
      className="group bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all duration-200"
      onClick={onClick}
    >
      {/* top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-bold text-gray-900 text-sm">
            #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3" />
            {fmtDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* product thumbnails */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex -space-x-2">
          {previewItems.map((item: any, i: number) => (
            <div
              key={item._id ?? i}
              className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white bg-gray-100 flex-shrink-0"
            >
              <Image
                src={item.productInfo?.featuredImg ?? "/placeholder.svg"}
                alt={item.productInfo?.description?.name ?? "Product"}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
          {extraCount > 0 && (
            <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 flex-shrink-0">
              +{extraCount}
            </div>
          )}
        </div>
        <div className="ml-auto text-right">
          <p className="font-bold text-gray-900">{fmtAmt(total)}</p>
          <p className="text-xs text-gray-400">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PayBadge
            status={order.paymentStatus}
            info={order.paymentInfo}
          />
          {order?.coupon?.discountAmount > 0 && (
            <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
              Saved {fmtAmt(order.coupon.discountAmount)}
            </span>
          )}
        </div>
        <span className="text-xs font-medium text-orange-600 flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
          Details <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}

/* ─── success modal ───────────────────────────────────────── */

function SuccessModal({
  message,
  transactionId,
  onClose,
}: {
  message: string;
  transactionId: string | null;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-slide-up">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment successful!
        </h2>
        <p className="text-gray-500 text-sm mb-5">{message}</p>
        {transactionId && (
          <div className="bg-gray-50 rounded-xl p-3 mb-5">
            <p className="text-xs text-gray-400 mb-1">Transaction ID</p>
            <p className="font-mono text-sm font-semibold text-gray-800 break-all">
              {transactionId}
            </p>
          </div>
        )}
        <Button
          onClick={onClose}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-2"
        >
          Close
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.28s cubic-bezier(0.32, 0.72, 0, 1) both;
        }
      `}</style>
    </div>
  );
}

/* ─── main component ──────────────────────────────────────── */

export default function MyOrdersTable() {
  const params = useSearchParams();
  const [queryParams, setQueryParams] = useState<IQueryParams>({ limit: 8 });
  const customerDetails = useAppSelector(selectCustomer);
  const [cancelOrderApi] = useCancelOrderMutation();
  const [reTryPayment] = useRetryPaymentMutation();

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetMyOrdersQuery(
    { id: customerDetails?._id as string, params: queryParams },
    {
      skip: !customerDetails?._id,
      pollingInterval: 30000,      // auto-refresh every 30 s
      refetchOnFocus: true,        // refetch when tab regains focus
      refetchOnReconnect: true,    // refetch on internet reconnect
    }
  );

  // Store only the ID — always derive the full order from latest query data
  // so any admin status change is instantly reflected when polling fires
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [paymentDetails, setPaymentDetails] = useState<{
    message: string;
    transactionId: string | null;
  } | null>(null);
  const hasShownToast = useRef(false);

  // Always live — derived from latest polled data, never stale
  const selectedOrder = selectedOrderId
    ? (orders?.data?.find((o: any) => o._id === selectedOrderId) ?? null)
    : null;

  // Track last refresh time for the UI indicator
  useEffect(() => {
    if (orders) setLastRefresh(new Date());
  }, [orders]);

  // Visibility-based refetch (extra insurance on top of pollingInterval)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refetch();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [refetch]);

  /* handle payment redirect callbacks */
  useEffect(() => {
    if (hasShownToast.current) return;
    const status = params.get("status");
    const message = params.get("message");
    const txnId = params.get("transactionId");

    if (status === "success") {
      setPaymentDetails({
        message: message ?? "Your payment has been processed successfully!",
        transactionId: txnId,
      });
      setShowSuccessModal(true);
      hasShownToast.current = true;
      refetch();
    } else if (["fail", "failed", "cancel"].includes(status ?? "")) {
      toast.error(
        message ?? "Payment was unsuccessful. Please try again.",
        { duration: 5000, icon: "❌" }
      );
      hasShownToast.current = true;
    }
  }, [params, refetch]);

  /* sync page param */
  useEffect(() => {
    setQueryParams((prev) => ({ ...prev, page: currentPage }));
  }, [currentPage]);

  const handleCancel = async (id: string) => {
    try {
      await cancelOrderApi(id).unwrap();
      refetch();
      setSelectedOrderId(null);
      toast.success("Order cancelled successfully!");
    } catch {
      toast.error(
        "Unable to cancel order. Please contact customer support.",
        { duration: 5000, icon: "⚠️" }
      );
    }
  };

  const handleRetry = async (paymentId: string) => {
    setIsPaymentStart(true);
    try {
      const res = await reTryPayment(paymentId).unwrap();
      toast.success("Redirecting to payment gateway…");
      window.location.href = res.data;
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsPaymentStart(false);
    }
  };

  /* ── loading ── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading your orders…</p>
      </div>
    );
  }

  /* ── error ── */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <XCircle className="w-14 h-14 text-red-400" />
        <p className="font-medium text-gray-800">Unable to load orders</p>
        <p className="text-sm text-gray-500">Please try refreshing the page</p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="mt-1"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* ── page ── */}
      <div className="w-full max-w-5xl mx-auto px-4 py-6 mt-4">
        {/* header */}
   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

  {/* Left Side */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
      <ShoppingBag className="w-5 h-5 text-orange-600" />
    </div>

    <div>
      <h1 className="text-lg sm:text-xl font-bold text-gray-900">
        My orders
      </h1>
      <p className="text-xs sm:text-sm text-gray-500">
        Track and manage your purchases
      </p>
    </div>
  </div>

  {/* Right Side */}
  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 sm:ml-auto">

    {/* Orders Count */}
    {orders?.data?.length > 0 && (
      <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
        {orders.meta?.total ?? orders.data.length} orders
      </span>
    )}

    {/* Live Indicator */}
    <div className="flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      <span>
        Live ·{" "}
        {lastRefresh.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>

    {/* Refresh Button */}
    <button
      onClick={() => refetch()}
      className="text-xs text-gray-500 hover:text-orange-500 transition-colors underline underline-offset-2"
    >
      Refresh
    </button>
  </div>
</div>

        {/* empty */}
        {orders?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Package className="w-16 h-16 text-gray-200" />
            <h3 className="text-lg font-semibold text-gray-700">
              No orders yet
            </h3>
            <p className="text-sm text-gray-400 max-w-xs">
              Start shopping and your orders will appear here.
            </p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white mt-1">
                Start shopping
              </Button>
            </Link>
          </div>
        ) : (
          /* card grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders?.data?.map((order: any) => (
              <OrderCard
                key={order._id}
                order={order}
                onClick={() => setSelectedOrderId(order._id)}
              />
            ))}
          </div>
        )}

        {/* pagination */}
        <div className="mt-6">
          <PaginationView
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            meta={orders?.meta}
          />
        </div>
      </div>

      {/* ── drawer ── */}
      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onCancel={handleCancel}
          onRetry={handleRetry}
          isRetrying={isPaymentStart}
        />
      )}

      {/* ── success modal ── */}
      {showSuccessModal && paymentDetails && (
        <SuccessModal
          message={paymentDetails.message}
          transactionId={paymentDetails.transactionId}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </>
  );
}