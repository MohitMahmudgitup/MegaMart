import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt } from "lucide-react";

interface IShipping {
  shippingLocation: 'dhaka' | 'outside_dhaka' | '';
  shippingCharge: number;
}

const OrderSummary = ({
  finalOrder,
  setOrderNote,
  shipping,
  discount,
  appliedCoupon,
}: {
  finalOrder: any;
  setOrderNote: (note: string) => void;
  shipping: IShipping;
  discount: number;
  appliedCoupon: any;
}) => {
  const subtotal = finalOrder.totalAmount || 0;
  const shippingCost = shipping.shippingCharge || 0;
  const total = subtotal + shippingCost - discount;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <Receipt size={20} /> Order Summary
        </h2>

        <div className="space-y-3 mb-4">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-medium">৳{subtotal.toFixed(2)}</span>
          </div>

          {/* Tax */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (0%)</span>
            <span className="text-gray-900">৳0.00</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            {shippingCost > 0 ? (
              <span className="text-gray-900 font-medium">৳{shippingCost.toFixed(2)}</span>
            ) : (
              <span className="text-amber-600 text-xs">Select location</span>
            )}
          </div>

          {/* Discount */}
          {appliedCoupon && discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                Discount
                <span className="text-xs text-orange-600 font-medium">
                  ({appliedCoupon.code})
                </span>
              </span>
              <span className="text-green-600 font-semibold">-৳{discount.toFixed(2)}</span>
            </div>
          )}

          {/* Total */}
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-semibold text-base">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900 text-lg">৳{total.toFixed(2)}</span>
            </div>
            {appliedCoupon && discount > 0 && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                You saved ৳{discount.toFixed(2)} with this coupon!
              </p>
            )}
          </div>
        </div>

        {/* Order Notes */}
        <div className="mt-6">
          <Label className="text-sm font-medium mb-2 block">
            Order Notes (Optional)
          </Label>
          <Input
            onChange={(e) => setOrderNote(e.target.value)}
            placeholder="Add any special instructions..."
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
