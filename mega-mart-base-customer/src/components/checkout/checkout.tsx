'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Shield, Truck, Check, Minus, Plus, X, Tag, ChevronDown, AlertCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectCustomer, updateCartItemQuantity } from '@/redux/featured/customer/customerSlice';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useCreateOrderMutation } from '@/redux/featured/order/orderApi';
import { selectCurrentUser } from '@/redux/featured/auth/authSlice';
import { useUpdateCustomerMutation } from '@/redux/featured/customer/customerApi';
import { useRouter } from 'next/navigation';
import {
  clearGuestCart, getGuestCart, addGuestOrderId,
} from '@/utils/guestCart';

/* ── inline toast/alert (no browser alert) ─────────────────── */
function InlineAlert({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-600 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg animate-fade-in">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [createOrder] = useCreateOrderMutation();
  const currentUser = useAppSelector(selectCurrentUser);
  const customerDetails = useAppSelector(selectCustomer);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');

  /* refs for auto-scroll */
  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const postalRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);
  const couponRef = useRef<HTMLDivElement>(null);

  /* form */
  const [form, setForm] = useState({
    name: '', address: '', city: '', postalCode: '', country: 'Bangladesh', phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* shipping */
  const [shippingLocation, setShippingLocation] = useState<'dhaka' | 'outside_dhaka' | ''>('');
  const shippingCharge = shippingLocation === 'dhaka' ? 70 : shippingLocation === 'outside_dhaka' ? 120 : 0;

  /* coupon */
  const [couponCode, setCouponCode] = useState('');
  const [couponOpen, setCouponOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  /* ── cart items ──────────────────────────────────────────── */
  const isGuest = !currentUser;
  const guestCartItems = isGuest ? getGuestCart() : [];

  const orderItems = isGuest
    ? guestCartItems.map(item => ({
        productId: [{
          _id: item.productId,
          description: { name: item.name },
          productInfo: { salePrice: item.salePrice },
          featuredImg: item.featuredImg,
        }],
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      }))
    : customerDetails?.cartItem[0]?.productInfo || [];

  const subTotal = orderItems.reduce((acc, item) => {
    return acc + (item.productId[0]?.productInfo?.salePrice || 0) * item.quantity;
  }, 0);

  /* discount */
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'fixed') return appliedCoupon.discountAmount;
    const pct = (subTotal * appliedCoupon.discountAmount) / 100;
    return appliedCoupon.maximumDiscount ? Math.min(pct, appliedCoupon.maximumDiscount) : pct;
  }, [appliedCoupon, subTotal]);

  const total = subTotal + shippingCharge - discount;

  /* ── helpers ─────────────────────────────────────────────── */
  const scrollTo = (ref: React.RefObject<HTMLElement | null>, offset = -100) => {
    if (ref.current) {
      const top = ref.current.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const showAlert = (msg: string) => {
    setAlert(msg);
    setTimeout(() => setAlert(''), 4000);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(p => ({ ...p, [id]: value }));
    if (errors[id]) setErrors(p => { const n = { ...p }; delete n[id]; return n; });
  };

  /* ── quantity (logged-in) ────────────────────────────────── */
  const handleQty = async (productId: string, type: 'inc' | 'dec') => {
    if (!customerDetails) return;
    dispatch(updateCartItemQuantity({ productId, type }));
    const item = customerDetails?.cartItem?.[0]?.productInfo?.find((i: any) =>
      i.productId.some((p: any) => (typeof p === 'string' ? p : p._id) === productId)
    );
    if (!item) return;
    const newQty = type === 'inc' ? item.quantity + 1 : Math.max(item.quantity - 1, 1);
    try {
      await updateCustomer({
        id: customerDetails._id,
        body: {
          cartItem: [{
            userId: currentUser?._id,
            productInfo: customerDetails?.cartItem?.[0]?.productInfo?.map((i: any) => {
              const ids = i.productId.map((p: any) => typeof p === 'string' ? p : p._id);
              return {
                productId: [String(i.productId[0]._id || i.productId[0])],
                quantity: ids.includes(productId) ? newQty : i.quantity,
                totalAmount: i.totalAmount,
                color: i.color || '',
                size: i.size || '',
              };
            }) ?? [],
          }],
        },
      });
    } catch { toast.error('Failed to update quantity.'); }
  };

  /* ── remove item (logged-in) ─────────────────────────────── */
  const [removingId, setRemovingId] = useState<string | null>(null);
  const handleRemove = async (productId: string) => {
    if (!customerDetails) return;
    setRemovingId(productId);
    const updated = customerDetails?.cartItem?.[0]?.productInfo?.filter((i: any) =>
      !i.productId.some((p: any) => (typeof p === 'string' ? p : String(p._id)) === productId)
    ) || [];
    try {
      await updateCustomer({
        id: customerDetails._id,
        body: {
          cartItem: [{
            userId: currentUser?._id,
            productInfo: updated.map((i: any) => ({
              productId: i.productId.map((p: any) => typeof p === 'string' ? p : String(p._id)),
              quantity: i.quantity,
              totalAmount: i.totalAmount,
              color: i.color || '',
              size: i.size || '',
            })),
          }],
        },
      });
      toast.success('Item removed');
    } catch { toast.error('Failed to remove item'); }
    setRemovingId(null);
  };

  /* ── coupon ──────────────────────────────────────────────── */
  const applyCoupon = async () => {
    setCouponMsg(null);
    if (!couponCode.trim()) { setCouponMsg({ type: 'error', text: 'Enter a coupon code' }); return; }
    setCouponLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/coupon?code=${couponCode.toUpperCase()}`);
      const data = await res.json();
      if (!data.success || !data.data?.length) {
        setCouponMsg({ type: 'error', text: 'Invalid coupon code' }); setCouponLoading(false); return;
      }
      const c = data.data[0];
      if (!c.isActive) { setCouponMsg({ type: 'error', text: 'Coupon is no longer active' }); setCouponLoading(false); return; }
      if (new Date(c.expireDate) < new Date()) { setCouponMsg({ type: 'error', text: 'Coupon has expired' }); setCouponLoading(false); return; }
      if (c.minimumOrderAmount > subTotal) {
        setCouponMsg({ type: 'error', text: `Min. order ৳${c.minimumOrderAmount} required` }); setCouponLoading(false); return;
      }
      setAppliedCoupon(c);
      const saved = c.type === 'fixed' ? c.discountAmount : Math.min((subTotal * c.discountAmount) / 100, c.maximumDiscount || Infinity);
      setCouponMsg({ type: 'success', text: `Saved ৳${saved.toFixed(0)}!` });
      toast.success(`Coupon "${c.code}" applied!`);
    } catch { setCouponMsg({ type: 'error', text: 'Failed to validate coupon' }); }
    setCouponLoading(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null); setCouponCode(''); setCouponMsg(null);
    toast.success('Coupon removed');
  };

  /* ── place order ─────────────────────────────────────────── */
  const handlePlaceOrder = async () => {
    /* validate form */
    const newErrors: Record<string, string> = {};
    if (!form.name) { newErrors.name = 'Required'; scrollTo(nameRef); }
    if (!form.address) { newErrors.address = 'Required'; if (!newErrors.name) scrollTo(addressRef); }
    if (!form.city) { newErrors.city = 'Required'; if (!newErrors.name && !newErrors.address) scrollTo(cityRef); }
    if (!form.postalCode) { newErrors.postalCode = 'Required'; if (Object.keys(newErrors).length === 1) scrollTo(postalRef); }
    if (!form.phone) { newErrors.phone = 'Required'; if (Object.keys(newErrors).length === 1) scrollTo(phoneRef); }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      const firstKey = Object.keys(newErrors)[0];
      const refMap: Record<string, React.RefObject<HTMLElement | null>> = {
        name: nameRef, address: addressRef, city: cityRef, postalCode: postalRef, phone: phoneRef,
      };
      scrollTo(refMap[firstKey]);
      return;
    }

    if (!shippingLocation) {
      scrollTo(shippingRef, -80);
      showAlert('Please select a delivery location before placing your order');
      return;
    }

    if (orderItems.length === 0) { toast.error('Your cart is empty'); return; }

    const parts = form.name.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    const shippingInfo = { name: 'Express Shipping', type: 'amount' as const };

    const orderInfo = orderItems.map(item => {
      const product = item.productId[0];
      const itemSubTotal = (product?.productInfo?.salePrice || 0) * item.quantity;
      return {
        orderBy: customerDetails?._id,
        shopInfo: 'shopId' in product ? product.shopId : null,
        vendorId: 'vendorId' in product ? product.vendorId : null,
        productInfo: product?._id,
        status: 'pending',
        isCancelled: false,
        quantity: item.quantity,
        totalAmount: { subTotal: itemSubTotal, tax: 0, shipping: shippingInfo, discount, total: itemSubTotal },
      };
    });

    const finalOrder = {
      orderInfo,
      shipping: { shippingLocation, shippingCharge },
      totalAmount: subTotal,
      payableAmount: total,
      customerInfo: { firstName, lastName, email: '', phone: form.phone, address: form.address, city: form.city, postalCode: form.postalCode, country: form.country },
      paymentInfo: 'cash-on',
      orderBy: currentUser?._id || null,
      isGuest: !currentUser,
      ...(appliedCoupon && {
        coupon: { couponId: appliedCoupon._id, code: appliedCoupon.code, discountAmount: discount, appliedBy: currentUser?._id || null },
      }),
    };

    setLoading(true);
    try {
      const result = await createOrder(finalOrder).unwrap();
      if (currentUser) {
        await updateCustomer({
          id: customerDetails?._id as string,
          body: { cartItem: [{ userId: currentUser._id, productInfo: [] }] },
        });
      } else {
        clearGuestCart();
        const orderId = result?.data?._id || result?._id;
        if (orderId) addGuestOrderId(orderId);
      }
      window.dispatchEvent(new Event('guestCartUpdated'));
      toast.success('Order placed successfully!');
      router.push('/dashboard/orders');
    } catch { toast.error('Failed to place order. Please try again.'); }
    setLoading(false);
  };

  /* ── render ──────────────────────────────────────────────── */
  return (
    <>
      {alert && <InlineAlert message={alert} onClose={() => setAlert('')} />}

      <div className="min-h-screen mt-6 mr-4 py-6 md:px-6">
        <div className=" mx-auto">

          {/* page title */}
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-500 mt-0.5">Fill in your details and confirm order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* ── LEFT: form ───────────────────────────────── */}
            <div className="lg:col-span-3 space-y-4">

              {/* Delivery info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                    <Truck className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">Delivery details</h2>
                </div>

                <div className="space-y-3">
                  <Field label="Full name" error={errors.name}>
                    <Input
                      id="name" ref={nameRef} value={form.name} onChange={handleInput}
                      placeholder="Your full name"
                      className={errors.name ? 'border-red-400 focus-visible:ring-red-300' : ''}
                    />
                  </Field>

                  <Field label="Address" error={errors.address}>
                    <Input
                      id="address" ref={addressRef} value={form.address} onChange={handleInput}
                      placeholder="Street, building, area"
                      className={errors.address ? 'border-red-400 focus-visible:ring-red-300' : ''}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="City" error={errors.city}>
                      <Input
                        id="city" ref={cityRef} value={form.city} onChange={handleInput}
                        placeholder="City"
                        className={errors.city ? 'border-red-400 focus-visible:ring-red-300' : ''}
                      />
                    </Field>
                    <Field label="Postal code" error={errors.postalCode}>
                      <Input
                        id="postalCode" ref={postalRef} value={form.postalCode} onChange={handleInput}
                        placeholder="1200"
                        className={errors.postalCode ? 'border-red-400 focus-visible:ring-red-300' : ''}
                      />
                    </Field>
                  </div>

                  <Field label="Phone number" error={errors.phone}>
                    <Input
                      id="phone" ref={phoneRef} type="tel" value={form.phone} onChange={handleInput}
                      placeholder="+880 1X XX XXX XXX"
                      className={errors.phone ? 'border-red-400 focus-visible:ring-red-300' : ''}
                    />
                  </Field>
                </div>
              </div>

              {/* Shipping location */}
<div
  ref={shippingRef}
  className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5"
>
  <h2 className="text-base font-semibold text-gray-900 mb-3">
    Delivery area
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <ShippingOption
      selected={shippingLocation === "dhaka"}
      onClick={() => setShippingLocation("dhaka")}
      title="Chittagong city"
      price="৳70"
      sub="Inside city"
    />

    <ShippingOption
      selected={shippingLocation === "outside_dhaka"}
      onClick={() => setShippingLocation("outside_dhaka")}
      title="Outside Chittagong"
      price="৳120"
      sub="Rest of Bangladesh"
    />
  </div>

  {!shippingLocation && (
    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
      <AlertCircle className="w-3.5 h-3.5" />
      Select your delivery area
    </p>
  )}
</div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Payment</h2>
                <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-orange-400 bg-orange-50">
                  <div className="w-5 h-5 rounded-full border-2 border-orange-500 bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when your order arrives</p>
                  </div>
                  <Check className="w-4 h-4 text-orange-500 ml-auto" />
                </div>
              </div>

              {/* Coupon */}
              <div ref={couponRef} className="bg-white rounded-2xl border border-gray-100 p-5">
                <button
                  onClick={() => setCouponOpen(v => !v)}
                  className="flex items-center gap-2 w-full text-left"
                >
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Have a promo code?</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${couponOpen ? 'rotate-180' : ''}`} />
                </button>

                {couponOpen && (
                  <div className="mt-3">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-green-800">{appliedCoupon.code}</p>
                          <p className="text-xs text-green-600">-৳{discount.toFixed(0)} saved</p>
                        </div>
                        <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <Input
                            value={couponCode}
                            onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponMsg(null); }}
                            placeholder="PROMO CODE"
                            className="flex-1 font-mono text-sm tracking-widest uppercase"
                            onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                          />
                          <Button
                            onClick={applyCoupon}
                            disabled={couponLoading || !couponCode.trim()}
                            className="bg-gray-900 hover:bg-black text-white px-4 shrink-0"
                          >
                            {couponLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Apply'}
                          </Button>
                        </div>
                        {couponMsg && (
                          <p className={`text-xs mt-2 flex items-center gap-1 ${couponMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            {couponMsg.type === 'error' ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                            {couponMsg.text}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: order summary ──────────────────────── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:sticky lg:top-4">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Order ({orderItems.length} {orderItems.length === 1 ? 'item' : 'items'})
                </h2>

                {/* items */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-4">
                  {orderItems.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">Your cart is empty</p>
                  ) : orderItems.map((item: any, i: number) => (
                    <div key={i} className="flex gap-3 group">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                        <Image
                          src={item.productId[0]?.featuredImg || '/placeholder.png'}
                          alt={item.productId[0]?.description?.name || 'Product'}
                          width={56} height={56} className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.productId[0]?.description?.name}
                        </p>
                        {(item.color || item.size) && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {[item.color, item.size].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-1.5">
                          {!isGuest ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleQty(item.productId[0]._id, 'dec')}
                                disabled={item.quantity <= 1}
                                className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleQty(item.productId[0]._id, 'inc')}
                                className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleRemove(item.productId[0]._id)}
                                disabled={removingId === item.productId[0]._id}
                                className="ml-1 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                          )}
                          <p className="text-sm font-bold text-gray-900">
                            ৳{((item.productId[0]?.productInfo?.salePrice || 0) * item.quantity).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* price breakdown */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <PriceRow label="Subtotal" value={`৳${subTotal.toFixed(0)}`} />
                  <PriceRow
                    label="Delivery"
                    value={shippingCharge > 0 ? `৳${shippingCharge}` : '—'}
                    hint={!shippingLocation ? 'Select area' : undefined}
                  />
                  {discount > 0 && (
                    <PriceRow label={`Discount (${appliedCoupon?.code})`} value={`-৳${discount.toFixed(0)}`} green />
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">৳{total.toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <p className="text-xs text-green-600 text-right">You saved ৳{discount.toFixed(0)}!</p>
                  )}
                </div>

                {/* trust */}
                <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded-xl">
                  <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-gray-500">Secure checkout · No hidden charges</span>
                </div>

                {/* CTA */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60 text-white font-semibold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing order...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Confirm order · ৳{total.toFixed(0)}
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-400 mt-2">
                  Cash on delivery · Pay when received
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.25s ease both; }
      `}</style>
    </>
  );
}

/* ── small components ────────────────────────────────────── */

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-medium text-gray-600 mb-1 block">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function ShippingOption({ selected, onClick, title, price, sub }: {
  selected: boolean; onClick: () => void; title: string; price: string; sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${
        selected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300 bg-white'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
        }`}>
          {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-400">{sub}</p>
        </div>
        <span className={`ml-auto text-sm font-bold ${selected ? 'text-orange-600' : 'text-gray-700'}`}>{price}</span>
      </div>
    </button>
  );
}

function PriceRow({ label, value, hint, green }: { label: string; value: string; hint?: string; green?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={green ? 'text-green-600 font-medium' : hint ? 'text-amber-500 text-xs' : 'text-gray-900'}>
        {hint || value}
      </span>
    </div>
  );
}