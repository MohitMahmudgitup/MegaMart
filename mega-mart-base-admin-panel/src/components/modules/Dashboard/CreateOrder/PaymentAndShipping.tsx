'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, MapPin, Percent, Check, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface IShipping {
  shippingLocation: 'dhaka' | 'outside_dhaka' | '';
  shippingCharge: number;
}

interface Props {
  shipping: IShipping;
  handleShippingChange: (location: 'dhaka' | 'outside_dhaka') => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: any;
  setAppliedCoupon: (coupon: any) => void;
}

const PaymentAndShipping = ({ 
  shipping, 
  handleShippingChange,
  couponCode,
  setCouponCode,
  appliedCoupon,
  setAppliedCoupon
}: Props) => {
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsValidatingCoupon(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/coupon?code=${couponCode.toUpperCase()}`
      );
      const data = await response.json();

      if (!data.success || !data.data || data.data.length === 0) {
        toast.error('Invalid coupon code');
        setIsValidatingCoupon(false);
        return;
      }

      const coupon = data.data[0];

      // Basic validation
      if (!coupon.isActive) {
        toast.error('This coupon is no longer active');
        setIsValidatingCoupon(false);
        return;
      }

      const now = new Date();
      const expireDate = new Date(coupon.expireDate);
      if (expireDate < now) {
        toast.error('This coupon has expired');
        setIsValidatingCoupon(false);
        return;
      }

      setAppliedCoupon(coupon);
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
      setIsValidatingCoupon(false);
    } catch (error) {
      console.error('Coupon validation error:', error);
      toast.error('Failed to validate coupon');
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <CreditCard size={20} /> Payment & Shipping
        </h2>

        <div className="space-y-6">
          {/* Payment Method - Fixed to Cash on Delivery */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Payment Method</Label>
            <div className="p-4 border-2 border-orange-500 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-600">Payment will be collected upon delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Location */}
          <div>
            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Shipping Location <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-3">
              {/* Dhaka Option */}
              <label
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  shipping.shippingLocation === 'dhaka'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    value="dhaka"
                    checked={shipping.shippingLocation === 'dhaka'}
                    onChange={() => handleShippingChange('dhaka')}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dhaka</p>
                    <p className="text-xs text-gray-500">Inside Dhaka city</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">৳70</span>
              </label>

              {/* Outside Dhaka Option */}
              <label
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  shipping.shippingLocation === 'outside_dhaka'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    value="outside_dhaka"
                    checked={shipping.shippingLocation === 'outside_dhaka'}
                    onChange={() => handleShippingChange('outside_dhaka')}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Outside Dhaka</p>
                    <p className="text-xs text-gray-500">Rest of Bangladesh</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">৳120</span>
              </label>
            </div>
          </div>

          {/* Coupon Code - Optional */}
          <div>
            <Label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Apply Coupon (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={!!appliedCoupon}
                className="flex-1"
              />
              {!appliedCoupon ? (
                <Button
                  type="button"
                  onClick={validateCoupon}
                  disabled={isValidatingCoupon || !couponCode.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isValidatingCoupon ? 'Validating...' : 'Apply'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={removeCoupon}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Applied Coupon Display */}
            {appliedCoupon && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900">
                    {appliedCoupon.code} Applied!
                  </p>
                  <p className="text-xs text-green-700">
                    {appliedCoupon.type === 'percentage' 
                      ? `${appliedCoupon.discountAmount}% discount` 
                      : `৳${appliedCoupon.discountAmount} discount`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentAndShipping;
