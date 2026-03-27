"use client";

import { Button } from "@/components/ui/button";
import { useGetAllCouponsQuery } from "@/redux/featured/coupons/couponApi";
import { useGetSingleShopQuery } from "@/redux/featured/shop/shopApi";
import { ICoupon } from "@/types/coupon";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Copy, Check, Tag, Calendar, Users, ShoppingCart, Percent, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function OffersPage() {
  const { shopId } = useParams() as { shopId: string };
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const {
    data: couponsData,
    isLoading: couponsLoading,
    isError: couponsError,
  } = useGetAllCouponsQuery({ shopId });

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Coupon code "${code}" copied!`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDiscountText = (coupon: ICoupon) => {
    if (coupon.type === "percentage") {
      return `${coupon.discountAmount}% OFF`;
    } else {
      return `৳${coupon.discountAmount} OFF`;
    }
  };

  const getCouponStatus = (coupon: ICoupon) => {
    const now = new Date();
    const expireDate = new Date(coupon.expireDate);
    const activeDate = coupon.activeDate ? new Date(coupon.activeDate) : null;

    if (!coupon.isActive)
      return { status: "inactive", color: "bg-gray-100 text-gray-600" };
    if (expireDate < now)
      return { status: "expired", color: "bg-red-100 text-red-600" };
    if (activeDate && activeDate > now)
      return { status: "upcoming", color: "bg-blue-100 text-blue-600" };
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { status: "limit reached", color: "bg-orange-100 text-orange-600" };
    }
    return { status: "active", color: "bg-green-100 text-green-600" };
  };

  if ( couponsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-500">Loading offers...</span>
      </div>
    );
  }

  if (couponsError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading offers. Please try again.</p>
      </div>
    );
  }

  if (!couponsData?.data || couponsData.data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <Tag className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No Offers Available
        </h3>
        <p className="text-gray-500">
          This shop doesn&apos;t have any active offers at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h1>
        <p className="text-gray-600">
          Exclusive deals and discounts
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {couponsData.data.map((coupon: ICoupon) => {
          const status = getCouponStatus(coupon);
          return (
            <div
              key={coupon._id}
              className="border rounded-xl p-6 flex flex-col justify-between shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <div>
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                  >
                    {status.status.toUpperCase()}
                  </span>
                  {coupon.scope === "global" && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                      Global Offer
                    </span>
                  )}
                </div>

                {/* Discount Header */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    {coupon.type === "percentage" ? (
                      <Percent className="w-6 h-6 text-orange-600" />
                    ) : (
                      <DollarSign className="w-6 h-6 text-orange-600" />
                    )}
                    <div className="text-3xl font-bold text-orange-600">
                      {getDiscountText(coupon)}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {coupon.description || "Special Discount"}
                  </h3>
                </div>

                {/* Coupon Details */}
                <div className="space-y-3 mb-4">
                  {/* Minimum Order */}
                  {coupon.minimumOrderAmount > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ShoppingCart className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Minimum order: ৳{coupon.minimumOrderAmount}</span>
                    </div>
                  )}

                  {/* Maximum Discount */}
                  {coupon.type === "percentage" && coupon.maximumDiscount && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Maximum discount: ৳{coupon.maximumDiscount}</span>
                    </div>
                  )}

                  {/* Usage Limit */}
                  {coupon.usageLimit && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>
                        Used {coupon.usedCount || 0} of {coupon.usageLimit} times
                      </span>
                    </div>
                  )}

                  {/* Expiry Date */}
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Expires: {formatDate(coupon.expireDate)}</span>
                  </div>

                  {/* Auto Apply Badge */}
                  {coupon.autoApply && (
                    <div className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                      ✓ Auto-applied at checkout
                    </div>
                  )}
                </div>
              </div>

              {/* Copy Code Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <span className="font-mono font-bold text-lg text-gray-900">
                    {coupon.code}
                  </span>
                  <Button
                    onClick={() => copyToClipboard(coupon.code)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={status.status !== "active"}
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                {status.status === "active" && (
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => copyToClipboard(coupon.code)}
                  >
                    Use This Coupon
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
