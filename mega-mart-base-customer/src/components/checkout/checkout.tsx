/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ReactSelect from 'react-select';
import countryList from 'react-select-country-list';

import {
  Shield,
  CreditCard,
  Truck,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Minus,
  Plus,
  LucideListOrdered,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectCustomer, updateCartItemQuantity } from '@/redux/featured/customer/customerSlice';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useCreateOrderMutation } from '@/redux/featured/order/orderApi';
import { selectCurrentUser } from '@/redux/featured/auth/authSlice';
import { useUpdateCustomerMutation } from '@/redux/featured/customer/customerApi';
import { useRouter } from 'next/navigation';
import { usePayOrderMutation } from '@/redux/featured/payment/paymentApi';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [updateCustomer] = useUpdateCustomerMutation();
  const [createOrder] = useCreateOrderMutation();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [promoApplied, setPromoApplied] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const [createOrderLoading, setCreateOrderLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [payOrderWithSSLCommerz] = usePayOrderMutation();
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  

  const customerDetails = useAppSelector(selectCustomer);

  const orderItems = customerDetails?.cartItem[0]?.productInfo || [];


  const subTotal = orderItems.reduce((acc, item) => {
    const productPrice = item.productId[0].productInfo?.salePrice || 0;
    return acc + productPrice * item.quantity;
  }, 0);


  // Country options
  const countryOptions = useMemo(() => countryList().getData(), []);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    nameOnCard: '',
  });

  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  // Shipping state
  interface IShipping {
    shippingLocation: 'dhaka' | 'outside_dhaka' | '';
    shippingCharge: number;
  }

  const [shipping, setShipping] = useState<IShipping>({
    shippingLocation: '',
    shippingCharge: 0,
  });

  const handleShippingChange = (location: 'dhaka' | 'outside_dhaka') => {
    const charge = location === 'dhaka' ? 70 : 120;
    setShipping({
      shippingLocation: location,
      shippingCharge: charge,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateShippingForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.postalCode) errors.postalCode = 'Postal code is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.phone) errors.phone = 'Phone is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearCartData = async () => {
    await updateCustomer({
      id: customerDetails?._id as string,
      body: {
        cartItem: [
          {
            userId: currentUser?._id as string,
            productInfo: [],
          },
        ],
      },
    });
  };

  const shippingInfo = {
    name: 'Express Shipping',
    type: 'amount',
  };

  const tax = 0;
  
  // Calculate discount based on applied coupon
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'fixed') {
      return appliedCoupon.discountAmount;
    } else if (appliedCoupon.type === 'percentage') {
      const percentageDiscount = (subTotal * appliedCoupon.discountAmount) / 100;
      // Apply maximum discount cap if exists
      if (appliedCoupon.maximumDiscount && percentageDiscount > appliedCoupon.maximumDiscount) {
        return appliedCoupon.maximumDiscount;
      }
      return percentageDiscount;
    }
    return 0;
  };
  
  const discount = calculateDiscount();

  const orderInfo = orderItems.map(item => {
    const product = item.productId[0];
    const subTotal = (product.productInfo?.salePrice || 0) * item.quantity;
    const total = subTotal;
    return {
      orderBy: customerDetails?._id,
      shopInfo: product.shopId,
      vendorId: product.vendorId,
      productInfo: product._id,
      status: 'pending',
      isCancelled: false,
      quantity: item.quantity,
      totalAmount: {
        subTotal,
        tax,
        shipping: shippingInfo,
        discount,
        total,
      },
    };
  });

  const overallTotal = orderInfo.reduce(
    (acc, item) => acc + item.totalAmount.total,
    0
  );


 const handlePlaceOrder = async () => {
    // Validate cart has items
    if (orderItems.length === 0) {
      toast.error('Your cart is empty', {
        icon: '🛒',
        duration: 4000,
      });
      return;
    }

    // Validate shipping location is selected
    if (!shipping.shippingLocation) {
      toast.error('Please select a shipping location', {
        icon: '📍',
        duration: 4000,
      });
      return;
    }

    const finalOrder = {
      orderInfo,
      shipping: {
        shippingLocation: shipping.shippingLocation,
        shippingCharge: shipping.shippingCharge,
      },
      totalAmount: subTotal,
      payableAmount: subTotal + shipping.shippingCharge - discount,
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      paymentInfo:
        paymentMethod === 'cod'
          ? 'cash-on'
          : 'pay-with-sslCommerz',
      ...(appliedCoupon && {
        coupon: {
          couponId: appliedCoupon._id,
          code: appliedCoupon.code,
          discountAmount: discount,
          appliedBy: currentUser?._id,
        },
      }),
    };

    setCreateOrderLoading(true);
    try {
      // Create the order first
      const orderResponse = await createOrder(finalOrder).unwrap();
      if (paymentMethod === 'card') {
        const orderId =  orderResponse?.data?._id;
        
        if (!orderId) {
          throw new Error('Order ID not found');
        }

        try {
          const paymentResponse = await payOrderWithSSLCommerz(orderId).unwrap();
            await clearCartData();
            toast.success('Redirecting to payment gateway...')
            window.location.href = paymentResponse.data;
            return; 
          
        } catch (paymentError) {
          console.error('Payment error:', paymentError);
          toast.error('Failed to initiate payment. Please try again.');
          setCreateOrderLoading(false);
          return;
        }
      }

      // For COD, proceed normally without payment gateway
      setCreateOrderLoading(false);
      await clearCartData();
      router.push('/dashboard/orders');
      toast.success('Order placed successfully!');
    } catch (error) {
      setCreateOrderLoading(false);
      console.error('Order creation error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleNextStepOrSubmit = () => {
    if (currentStep === 1) {
      if (validateShippingForm()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      handlePlaceOrder();
    }
  };

  const validateCoupon = async () => {
    // Reset states
    setCouponError('');
    setCouponSuccess('');
    
    if (!promoCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsValidatingCoupon(true);

    try {
      // Fetch coupon by code
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/coupon?code=${promoCode.toUpperCase()}`
      );
      const data = await response.json();

      if (!data.success || !data.data || data.data.length === 0) {
        setCouponError('Invalid coupon code');
        setIsValidatingCoupon(false);
        return;
      }

      const coupon = data.data[0];

      // Validation 1: Check if coupon is active
      if (!coupon.isActive) {
        setCouponError('This coupon is no longer active');
        setIsValidatingCoupon(false);
        return;
      }

      // Validation 2: Check expiry date
      const now = new Date();
      const expireDate = new Date(coupon.expireDate);
      if (expireDate < now) {
        setCouponError('This coupon has expired');
        setIsValidatingCoupon(false);
        return;
      }

      // Validation 3: Check active date
      if (coupon.activeDate) {
        const activeDate = new Date(coupon.activeDate);
        if (activeDate > now) {
          setCouponError('This coupon is not yet active');
          setIsValidatingCoupon(false);
          return;
        }
      }

      // Validation 4: Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        setCouponError('This coupon has reached its usage limit');
        setIsValidatingCoupon(false);
        return;
      }

      // Validation 5: Check minimum order amount
      if (coupon.minimumOrderAmount > subTotal) {
        setCouponError(
          `Minimum order amount of $${coupon.minimumOrderAmount} required`
        );
        setIsValidatingCoupon(false);
        return;
      }

      // Validation 6: Check shop-specific coupons
      if (coupon.scope === 'shop' && coupon.shopId) {
        // Get all unique shop IDs from cart items
        const cartShopIds = orderItems.map(
          (item: any) => item.productId[0].shopId
        );
        const uniqueShopIds = [...new Set(cartShopIds)];

        // Check if coupon's shop matches any cart item's shop
        const isShopMatch = uniqueShopIds.includes(coupon.shopId);

        if (!isShopMatch) { 
          setCouponError(
            'This coupon is only valid for specific shop products'
          );
          setIsValidatingCoupon(false);
          return;
        }

        // If multiple shops in cart, warn user
        if (uniqueShopIds.length > 1) {
          setCouponSuccess(
            `Coupon applied! Note: Discount applies only to items from the coupon's shop`
          );
        }
      }

      // Validation 7: Check user restrictions
      if (
        coupon.userRestriction &&
        coupon.userRestriction.length > 0 &&
        currentUser?._id
      ) {
        const isUserAllowed = coupon.userRestriction.includes(
          currentUser._id
        );
        if (!isUserAllowed) {
          setCouponError('This coupon is not available for your account');
          setIsValidatingCoupon(false);
          return;
        }
      }

      // Validation 8: Check product restrictions
      if (coupon.productRestriction && coupon.productRestriction.length > 0) {
        const cartProductIds = orderItems.map(
          (item: any) => item.productId[0]._id
        );
        const hasRestrictedProduct = cartProductIds.some((productId: string) =>
          coupon.productRestriction.includes(productId)
        );

        if (!hasRestrictedProduct) {
          setCouponError(
            'This coupon is only valid for specific products'
          );
          setIsValidatingCoupon(false);
          return;
        }
      }

      // All validations passed - apply coupon
      setAppliedCoupon(coupon);
      setPromoApplied(true);
      
      const discountAmount = coupon.type === 'fixed' 
        ? coupon.discountAmount 
        : Math.min(
            (subTotal * coupon.discountAmount) / 100,
            coupon.maximumDiscount || Infinity
          );

      setCouponSuccess(
        `Coupon applied successfully! You saved $${discountAmount.toFixed(2)}`
      );
      toast.success(`Coupon "${coupon.code}" applied!`);
      setIsValidatingCoupon(false);
    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponError('Failed to validate coupon. Please try again.');
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setPromoApplied(false);
    setPromoCode('');
    setCouponError('');
    setCouponSuccess('');
    toast.success('Coupon removed');
  };

  const applyPromoCode = validateCoupon;

  const handleBackToShipping = () => setCurrentStep(1);
  const handleBackToPayment = () => setCurrentStep(2);
  const handleBackClick = () => {
    if (currentStep === 2) handleBackToShipping();
    if (currentStep === 3) handleBackToPayment();
  };

  const nextCtaText =
    currentStep === 1
      ? 'Continue to Payment'
      : currentStep === 2
      ? 'Review Order'
      : paymentMethod === 'card'
      ? 'Pay with SSL Commerz'
      : 'Confirm Order';

  
   // update quantity functions
  const handleQuantityChange = async (productId: string, type: "inc" | "dec") => {
    if (!customerDetails) return;

    // Find the item to update
    const itemToUpdate = customerDetails?.cartItem?.[0]?.productInfo?.find((item: any) => {
      const ids = item.productId.map((p: any) => typeof p === "string" ? p : p._id);
      return ids.includes(productId);
    });

    if (!itemToUpdate) return;

    // Calculate new quantity
    const newQuantity = type === "inc" ? itemToUpdate.quantity + 1 : Math.max(itemToUpdate.quantity - 1, 1);

    // Update locally first for immediate UI feedback
    dispatch(updateCartItemQuantity({ productId, type }));

    try {
      // Update on server
      await updateCustomer({
        id: customerDetails._id,
        body: {
          cartItem: [
            {
              userId: currentUser?._id,
              productInfo: customerDetails?.cartItem?.[0]?.productInfo?.map((item: any) => {
                const ids = item.productId.map((p: any) => typeof p === "string" ? p : p._id);
                
                if (ids.includes(productId)) {
                  return {
                    productId: [String(item.productId[0]._id || item.productId[0])],
                    quantity: newQuantity,
                    totalAmount: item.totalAmount,
                    color: item.color || '',
                    size: item.size || '',
                  };
                }
                
                return {
                  productId: [String(item.productId[0]._id || item.productId[0])],
                  quantity: item.quantity,
                  totalAmount: item.totalAmount,
                  color: item.color || '',
                  size: item.size || '',
                };
              }) ?? [],
            },
          ],
        },
      });
    } catch (error) {
      toast.error("Failed to update quantity.");
    }
  };

  // Remove item from cart
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  
  const handleRemoveItem = async (productId: string) => {
    if (!customerDetails) return;

    const updatedProductInfo =
      customerDetails?.cartItem?.[0]?.productInfo?.filter((item: any) => {
        const productIds = item.productId.map((p: any) =>
          typeof p === "string" ? p : String(p._id)
        );
        return !productIds.includes(productId);
      }) || [];

    try {
      setRemovingItemId(productId);

      await updateCustomer({
        id: customerDetails._id,
        body: {
          cartItem: [
            {
              userId: currentUser?._id,
              productInfo: updatedProductInfo.map((item: any) => ({
                productId: item.productId.map((p: any) =>
                  typeof p === "string" ? p : String(p._id)
                ),
                quantity: item.quantity,
                totalAmount: item.totalAmount,
                color: item.color || '',
                size: item.size || '',
              })),
            },
          ],
        },
      });

      toast.success("Item removed from cart");
      setRemovingItemId(null);
    } catch (error) {
      toast.error("Failed to remove item");
      setRemovingItemId(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#FFFFFF] py-4 md:py-8">
      <div className="w-full  md:px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            Complete Your Order
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6 md:mb-8">
            <div className="flex flex-col items-center w-24 md:w-32">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm ${
                  currentStep >= 1
                    ? 'text-orange-500 font-medium'
                    : 'text-gray-500'
                }`}
              >
                Shipping
              </span>
            </div>

            <div
              className={`w-8 md:w-16 h-1 ${
                currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />

            <div className="flex flex-col items-center w-24 md:w-32">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2
                    ? 'bg-orange-500 text-white'
                    : currentStep === 2
                    ? 'border-2 border-orange-500 text-orange-500 bg-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm ${
                  currentStep >= 2
                    ? 'text-orange-500 font-medium'
                    : 'text-gray-500'
                }`}
              >
                Payment
              </span>
            </div>

            <div
              className={`w-8 md:w-16 h-1 ${
                currentStep >= 3 ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />

            <div className="flex flex-col items-center w-24 md:w-32">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3
                    ? 'bg-orange-500 text-white'
                    : currentStep === 3
                    ? 'border-2 border-orange-500 text-orange-500 bg-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                3
              </div>
              <span
                className={`mt-2 text-xs md:text-sm ${
                  currentStep >= 3
                    ? 'text-orange-500 font-medium'
                    : 'text-gray-500'
                }`}
              >
                Review
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid Wrapped in Form */}
        <form onSubmit={e => e.preventDefault()}>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
              {currentStep === 1 ? (
                <>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <Truck className="w-4 h-4 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Shipping Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium"
                        >
                          First Name
                        </Label>
                        <Input
                          required
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`mt-1 ${
                            formErrors.firstName ? 'border-red-500' : ''
                          }`}
                        />
                        {formErrors.firstName && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium"
                        >
                          Last Name
                        </Label>
                        <Input
                          required
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`mt-1 ${
                            formErrors.lastName ? 'border-red-500' : ''
                          }`}
                        />
                        {formErrors.lastName && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        required
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`mt-1 ${
                          formErrors.email ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address
                      </Label>
                      <Input
                        required
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`mt-1 ${
                          formErrors.address ? 'border-red-500' : ''
                        }`}
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-xs text-red-500">
                          {formErrors.address}
                        </p>
                      )}
                    </div>

                    {/* City and Postal Code */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium">
                          City
                        </Label>
                        <Input
                          required
                          id="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`mt-1 ${
                            formErrors.city ? 'border-red-500' : ''
                          }`}
                        />
                        {formErrors.city && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="postalCode"
                          className="text-sm font-medium"
                        >
                          Postal Code
                        </Label>
                        <Input
                          required
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className={`mt-1 ${
                            formErrors.postalCode ? 'border-red-500' : ''
                          }`}
                        />
                        {formErrors.postalCode && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.postalCode}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Country and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="country"
                          className="text-sm font-medium"
                        >
                          Country
                        </Label>
                        <div className="mt-1">
                          <ReactSelect
                            options={countryOptions}
                            value={selectedCountry}
                            onChange={(value) => {
                              setSelectedCountry(value);
                              setFormData(prev => ({ ...prev, country: value?.label || '' }));
                              if (formErrors.country) {
                                setFormErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.country;
                                  return newErrors;
                                });
                              }
                            }}
                            placeholder="Select a country..."
                            className={formErrors.country ? 'border-red-500 rounded-md' : ''}
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                minHeight: '42px',
                                borderColor: formErrors.country ? '#ef4444' : state.isFocused ? '#f97316' : '#e5e7eb',
                                boxShadow: state.isFocused ? '0 0 0 1px #f97316' : 'none',
                                '&:hover': {
                                  borderColor: formErrors.country ? '#ef4444' : '#f97316',
                                },
                              }),
                              option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected ? '#f97316' : state.isFocused ? '#fed7aa' : 'white',
                                color: state.isSelected ? 'white' : '#111827',
                                '&:active': {
                                  backgroundColor: '#f97316',
                                },
                              }),
                            }}
                          />
                        </div>
                        {formErrors.country && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.country}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone
                        </Label>
                        <Input
                          required
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`mt-1 ${
                            formErrors.phone ? 'border-red-500' : ''
                          }`}
                        />
                        {formErrors.phone && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : currentStep === 2 ? (
                <>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <CreditCard className="w-4 h-4 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Payment Information
                    </h2>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Select Payment Method
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* SSL Commerz Option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
                          paymentMethod === 'card'
                            ? 'border-orange-500 bg-orange-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            paymentMethod === 'card'
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === 'card' && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CreditCard className="w-5 h-5 text-orange-600" />
                              <p className="font-semibold text-gray-900">
                                SSL Commerz
                              </p>
                            </div>
                            <p className="text-xs text-gray-600">
                              Secure payment via Visa, Mastercard, Amex
                            </p>
                            <div className="flex gap-1 mt-2">
                              <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold">VISA</span>
                              </div>
                              <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold">MC</span>
                              </div>
                              <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold">AMEX</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {paymentMethod === 'card' && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className="w-5 h-5 text-orange-500" />
                          </div>
                        )}
                      </button>

                      {/* Cash on Delivery Option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
                          paymentMethod === 'cod'
                            ? 'border-orange-500 bg-orange-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            paymentMethod === 'cod'
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === 'cod' && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Truck className="w-5 h-5 text-orange-600" />
                              <p className="font-semibold text-gray-900">
                                Cash on Delivery
                              </p>
                            </div>
                            <p className="text-xs text-gray-600">
                              Pay with cash when you receive your order
                            </p>
                            <p className="text-xs text-orange-600 mt-1 font-medium">
                              No extra charges
                            </p>
                          </div>
                        </div>
                        
                        {paymentMethod === 'cod' && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className="w-5 h-5 text-orange-500" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Info */}
                  {paymentMethod === 'card' && (
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 animate-in fade-in duration-300">
                      <div className="flex gap-3">
                        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Secure Payment Gateway
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            You'll be redirected to SSL Commerz secure payment page to complete your transaction.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 animate-in fade-in duration-300">
                      <div className="flex gap-3">
                        <Truck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-900">
                            Cash on Delivery
                          </p>
                          <p className="text-xs text-amber-700 mt-1">
                            Please have the exact amount ready when the delivery arrives. Our delivery partner will collect the payment.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Review Your Order
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Please confirm all details before placing your order
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Shipping Information */}
                    <div className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <Truck className="w-4 h-4 text-orange-600" />
                          </div>
                          Shipping Information
                        </h3>
                        <Button
                          type="button"
                          onClick={handleBackToShipping}
                          variant="outline"
                          size="sm"
                          className="text-orange-600 border-orange-300 hover:bg-orange-50 h-8 text-xs"
                        >
                          Edit
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formData.firstName} {formData.lastName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                            <p className="text-sm font-medium text-gray-900">{formData.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Address</p>
                            <p className="text-sm font-medium text-gray-900">{formData.address}</p>
                            <p className="text-sm text-gray-600">
                              {formData.city}, {formData.postalCode}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formData.country}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Phone Number</p>
                            <p className="text-sm font-medium text-gray-900">{formData.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        {paymentMethod === 'card' ? (
                          <CreditCard className="w-4 h-4 mr-2 text-orange-500" />
                        ) : (
                          <Truck className="w-4 h-4 mr-2 text-orange-500" />
                        )}
                        Payment Method
                      </h3>
                      
                      {paymentMethod === 'card' ? (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-white text-[8px] font-bold">VISA</span>
                            </div>
                            <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
                              <span className="text-white text-[8px] font-bold">MC</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            SSL Commerz Payment Gateway
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Truck className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 font-medium">
                              Cash on Delivery
                            </p>
                            <p className="text-xs text-gray-500">
                              Pay when you receive
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <Button
                        type="button"
                        onClick={handleBackToPayment}
                        variant="link"
                        className="text-orange-500 p-0 h-auto text-xs mt-2 hover:text-orange-600"
                      >
                        Change payment method
                      </Button>
                    </div>

                    {/* Items */}
                    <div className="border rounded-xl p-4 md:p-6 bg-white shadow-sm">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <LucideListOrdered className="w-5 h-5 text-orange-500" />
                        Order Items ({orderItems.length})
                      </h3>

                      <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                        {orderItems.length > 0 ? (
                          orderItems.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="relative flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors group"
                            >
                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemoveItem(item.productId[0]._id)}
                                disabled={removingItemId === item.productId[0]._id}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors opacity-0 group-hover:opacity-100 z-10"
                                title="Remove item"
                              >
                                {removingItemId === item.productId[0]._id ? (
                                  <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <X className="w-4 h-4 text-gray-500 hover:text-red-600" />
                                )}
                              </button>

                              {/* Product Image */}
                              <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                <div className="relative w-full h-full">
                                  <Image
                                    src={item?.productId[0]?.featuredImg || '/placeholder.png'}
                                    alt={item?.productId[0]?.description?.name || 'Product'}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0 pr-6">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {item?.productId[0]?.description?.name}
                                </h4>
                                
                                {/* Color and Size */}
                                <div className="flex gap-2 mt-1 flex-wrap">
                                  {item?.color !== '' && (
                                    <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                                      Color: <span className="font-medium">{item.color || ''}</span>
                                    </span>
                                  )}
                                  {item?.size !== '' && (
                                    <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                                      Size: <span className="font-medium">{item.size || ''}</span>
                                    </span>
                                  )}
                                </div>

                                {/* Quantity Controls and Price */}
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7 rounded-md"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.productId[0]._id,
                                          'dec'
                                        )
                                      }
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>

                                    <span className="text-sm font-semibold w-8 text-center text-gray-800">
                                      {item?.quantity}
                                    </span>

                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7 rounded-md"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.productId[0]._id,
                                          'inc'
                                        )
                                      }
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  {/* Price */}
                                  <div className="text-right">
                                    <p className="text-base font-bold text-gray-900">
                                      ${(item?.productId[0]?.productInfo?.salePrice * item?.quantity).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      ${item?.productId[0]?.productInfo?.salePrice} each
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <LucideListOrdered className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-base font-medium text-gray-900 mb-1">Your cart is empty</p>
                            <p className="text-sm text-gray-500">Add items to your cart to continue</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Left column action buttons (md and up) */}
              <div className="mt-6 hidden md:flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackClick}
                  className="bg-transparent text-gray-700 border-gray-300 h-10 px-4 text-sm"
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {currentStep === 2 ? 'Back to Shipping' : 'Back to Payment'}
                </Button>

                <Button
                  type="button"
                  onClick={handleNextStepOrSubmit}
                  disabled={currentStep === 3 && (orderItems.length === 0 || !shipping.shippingLocation)}
                  className="bg-orange-500 hover:bg-orange-600 h-10 px-5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createOrderLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {currentStep === 3 && paymentMethod === 'card' && (
                        <CreditCard className="w-4 h-4 mr-2" />
                      )}
                      {nextCtaText}
                      {currentStep < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 h-fit lg:sticky lg:top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6 pb-3 border-b">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 md:mb-6">
               

                {/* Shipping Location Selector */}
                <div className="border-t border-b py-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Select Shipping Location</span>
                    {shipping.shippingLocation && (
                      <span className="text-xs text-orange-600 font-medium">
                        ${shipping.shippingCharge}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {/* Dhaka Option */}
                    <label
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
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
                      <span className="text-sm font-semibold text-gray-900">$70</span>
                    </label>

                    {/* Outside Dhaka Option */}
                    <label
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
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
                      <span className="text-sm font-semibold text-gray-900">$120</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subTotal.toFixed(2)}</span>
                </div>
                {/* Shipping Cost Display */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  {shipping.shippingCharge > 0 ? (
                    <span className="text-gray-900 font-medium">${shipping.shippingCharge}</span>
                  ) : (
                    <span className="text-amber-600 text-xs">Please select location</span>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">Free</span>
                </div>
                {appliedCoupon && discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      Discount
                      <span className="text-xs text-orange-600 font-medium">
                        ({appliedCoupon.code})
                      </span>
                    </span>
                    <span className="text-green-600 font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900 text-lg">
                      ${(subTotal + shipping.shippingCharge - discount).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including VAT</p>
                  {appliedCoupon && discount > 0 && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      You saved ${discount.toFixed(2)} with this coupon!
                    </p>
                  )}
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">
                  Secure SSL encrypted checkout
                </span>
              </div>

              {/* Free Shipping Notice */}
              <div className="rounded-lg bg-blue-50 p-3 mb-4">
                <p className="text-xs text-blue-800 flex items-center">
                  <Truck className="w-3 h-3 mr-1" />
                  Free shipping on orders over $50!
                </p>
              </div>

              {/* Promo Code */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Have a promo code?
                </p>
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={e => {
                      setPromoCode(e.target.value.toUpperCase());
                      setCouponError('');
                      setCouponSuccess('');
                    }}
                    className={`flex-1 ${
                      couponError ? 'border-red-500' : couponSuccess ? 'border-green-500' : ''
                    }`}
                    disabled={promoApplied}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !promoApplied) {
                        applyPromoCode();
                      }
                    }}
                  />
                  {!promoApplied ? (
                    <Button
                      type="button"
                      onClick={applyPromoCode}
                      className="bg-gray-900 hover:bg-black  w-full md:w-auto flex items-center gap-2 text-white rounded-lg transition-all"
                      disabled={isValidatingCoupon || !promoCode.trim()}
                    >
                      {isValidatingCoupon ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Validating...</span>
                        </>
                      ) : (
                        'Apply Coupon'
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={removeCoupon}
                      variant="outline"
                      className="border-red-400 text-red-600 hover:bg-red-50  w-full md:w-auto rounded-lg transition-all"
                    >
                      Remove ✕
                    </Button>
                  )}

                </div>
                
                {/* Coupon Error Message */}
                {couponError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{couponError}</p>
                  </div>
                )}
                
                {/* Coupon Success Message */}
                {couponSuccess && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-600">{couponSuccess}</p>
                  </div>
                )}
                
                {/* Applied Coupon Display */}
                {appliedCoupon && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-orange-900 uppercase">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-xs text-orange-700 bg-white px-2 py-0.5 rounded">
                        {appliedCoupon.type === 'percentage' 
                          ? `${appliedCoupon.discountAmount}% OFF` 
                          : `$${appliedCoupon.discountAmount} OFF`}
                      </span>
                    </div>
                    {appliedCoupon.description && (
                      <p className="text-xs text-orange-800">{appliedCoupon.description}</p>
                    )}
                  </div>
                )}

                {/* Mobile-only unified controls under Promo Code */}
                <div className="mt-4 flex justify-end flex-col md:hidden gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackClick}
                    className="bg-transparent text-gray-700 border-gray-300 h-12 w-full"
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className=" mr-2" />
                    {currentStep === 2 ? 'Back to Shipping' : 'Back to Payment'}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNextStepOrSubmit}
                    disabled={currentStep === 3 && (orderItems.length === 0 || !shipping.shippingLocation)}
                    className="bg-orange-500 hover:bg-orange-600 px-6 py-2 h-12 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createOrderLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {currentStep === 3 && paymentMethod === 'card' && (
                          <CreditCard className="w-4 h-4 mr-2" />
                        )}
                        {nextCtaText}
                        {currentStep < 3 && <ArrowRight className=" ml-2" />}
                      </>
                    )}
                  </Button>
                </div>
                {/* End mobile controls */}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
