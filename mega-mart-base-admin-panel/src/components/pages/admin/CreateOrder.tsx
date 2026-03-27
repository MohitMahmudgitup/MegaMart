/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import AddProducts from "@/components/modules/Dashboard/CreateOrder/AddProducts";
import CustomerInfo from "@/components/modules/Dashboard/CreateOrder/CustomerInfo";
import OrderItems from "@/components/modules/Dashboard/CreateOrder/OrderItems";
import OrderSummary from "@/components/modules/Dashboard/CreateOrder/OrderSummary";
import PaymentAndShipping from "@/components/modules/Dashboard/CreateOrder/PaymentAndShipping";
import { Button } from "@/components/ui/button";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useCreateOrderMutation } from "@/redux/featured/order/orderApi";
import { useGetAllProductsQuery } from "@/redux/featured/products/productsApi";
import { useAppSelector } from "@/redux/hooks";
import { IProduct } from "@/types/Product";
import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const fields = [
  { label: "First Name", placeholder: "John", id: "firstName" },
  { label: "Last Name", placeholder: "Doe", id: "lastName" },
  {
    label: "Email",
    placeholder: "customer@email.com",
    id: "email",
    type: "email",
  },
  { label: "City", placeholder: "City", id: "city" },
  { label: "Address", placeholder: "Address", id: "address" },
  { label: "Postal code", placeholder: "Postal code", id: "postalcode" },
  { label: "Phone ", placeholder: "Phone ", id: "phone" },
  { label: "Country ", placeholder: "country ", id: "country" },
];

type SelectedProduct = {
  productId: string;
  quantity: number;
};

interface IShipping {
  shippingLocation: 'dhaka' | 'outside_dhaka' | '';
  shippingCharge: number;
}

const CreateOrder = () => {
  const [createOrder] = useCreateOrderMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: products,
    isLoading,
    error,
  } = useGetAllProductsQuery({ searchTerm });

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [createOrderLoading, setCreateOrderLoading] = useState(false);
  const [shipping, setShipping] = useState<IShipping>({
    shippingLocation: '',
    shippingCharge: 0,
  });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [orderNote, setOrderNote] = useState("");

  const currentUser = useAppSelector(selectCurrentUser);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handleShippingChange = (location: 'dhaka' | 'outside_dhaka') => {
    const charge = location === 'dhaka' ? 70 : 120;
    setShipping({
      shippingLocation: location,
      shippingCharge: charge,
    });
  };

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const allSelectedProducts = products
    ?.filter((product: IProduct) =>
      selectedProducts.some((p) => p.productId === product._id)
    )
    .map((product: IProduct) => {
      const qty =
        selectedProducts.find((p) => p.productId === product._id)?.quantity ||
        0;
      return { ...product, quantity: qty };
    });

  const shippingInfo = {
    name: "Express Shipping",
    type: "amount" as const,
  };

  const tax = 0;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const orderInfo = allSelectedProducts?.map((product) => {
    const subTotal =
      (product.productInfo?.salePrice || product.productInfo?.price || 0) *
      product.quantity;
    const total = subTotal;

    return {
      orderBy: currentUser?._id,
      shopInfo: product.shopId,
      productInfo: product._id,
      status: "pending",
      isCancelled: false,
      quantity: product.quantity,
      totalAmount: {
        subTotal,
        tax,
        shipping: shippingInfo,
        discount,
        total,
      },
    };
  });

  const subTotal = orderInfo?.reduce(
    (acc, item) => acc + item.totalAmount.total,
    0
  ) || 0;

  const payableAmount = subTotal + shipping.shippingCharge - discount;

  const finalOrder = {
    orderInfo,
    shipping: {
      shippingLocation: shipping.shippingLocation,
      shippingCharge: shipping.shippingCharge,
    },
    totalAmount: subTotal,
    payableAmount: payableAmount,
    customerInfo: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalcode,
      country: formData.country,
    },
    paymentInfo: 'cash-on' as const,
    ...(appliedCoupon && {
      coupon: {
        couponId: appliedCoupon._id,
        code: appliedCoupon.code,
        discountAmount: discount,
        appliedBy: currentUser?._id,
      },
    }),
    orderNote: orderNote,
  };

  const CreateFinalOrder = async () => {
    // Validation
    if (!shipping.shippingLocation) {
      return toast.error("Shipping Location is required!");
    }
    if (!formData.firstName) {
      return toast.error("First Name is required!");
    }
    if (!formData.lastName) {
      return toast.error("Last Name is required!");
    }
    if (!formData.email) {
      return toast.error("Email is required!");
    }
    if (!formData.city) {
      return toast.error("City is required!");
    }
    if (!formData.address) {
      return toast.error("Address is required!");
    }
    if (!formData.postalcode) {
      return toast.error("Postal Code is required!");
    }
    if (!formData.phone) {
      return toast.error("Phone Number is required!");
    }
    if (!formData.country) {
      return toast.error("Country is required!");
    }
    if (selectedProducts.length === 0) {
      return toast.error("Please add at least one product!");
    }

    setCreateOrderLoading(true);

    try {
      const res = await createOrder(finalOrder as any).unwrap();
      // Reset form
      setFormData({});
      setSelectedProducts([]);
      setShipping({
        shippingLocation: '',
        shippingCharge: 0,
      });
      setCouponCode("");
      setAppliedCoupon(null);
      setOrderNote("");
      setCreateOrderLoading(false);
      toast.success("Order created successfully!");
    } catch (error) {
      console.log(error);
      setCreateOrderLoading(false);
      toast.error("Failed to create order.");
    }
  };

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products</p>;

  return (
    <div className="py-6 p-2 sm:p-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
            Create New Order
          </h2>
          <p className="opacity-60 text-xs sm:text-sm lg:text-base">
            Manually create orders for customers
          </p>
        </span>
        <span className="flex items-center gap-2">
          <Button disabled variant={"outline"}>
            Save Draft
          </Button>
          <Button onClick={CreateFinalOrder}>
            <ShoppingCart />{" "}
            {createOrderLoading ? "Creating..." : "Create Order"}
          </Button>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-10">
        <div className="space-y-7 xl:col-span-2">
          <CustomerInfo
            handleChange={handleChange}
            formData={formData}
            fields={fields}
          />
          <AddProducts
            setSearchTerm={setSearchTerm}
            products={products || []}
            searchTerm={searchTerm}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />{" "}
          {/* Use fetched products */}
          <OrderItems
            products={allSelectedProducts}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
        </div>
        <div className="space-y-7 xl:col-span-1">
          <PaymentAndShipping 
            shipping={shipping}
            handleShippingChange={handleShippingChange}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
          />
          <OrderSummary 
            finalOrder={finalOrder} 
            setOrderNote={setOrderNote}
            shipping={shipping}
            discount={discount}
            appliedCoupon={appliedCoupon}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
