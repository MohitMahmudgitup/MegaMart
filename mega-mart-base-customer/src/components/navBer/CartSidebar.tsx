"use client";

import { IProduct } from "@/types/product";
import { Button } from "../ui/button";
import { LoaderCircle, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetSingleCustomerQuery,
  useUpdateCustomerMutation,
} from "@/redux/featured/customer/customerApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  setCustomer,
  updateCartItemQuantity,
} from "@/redux/featured/customer/customerSlice";
import {
  getGuestCart,
  setGuestCart,
  GuestCartItem,
} from "@/utils/guestCart";

interface CartItems {
  productId: [IProduct];
  quantity: number;
  totalAmount: number;
  color?: string;
  size?: string;
}

export default function CartSidebar({
  isCartOpen,
  setIsCartOpen,
  cartItems,
}: {
  isCartOpen: boolean;
  setIsCartOpen: any;
  cartItems: CartItems[];
}) {
  const dispatch = useAppDispatch();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const currentUser = useAppSelector(selectCurrentUser);

  const [guestCart, setGuestCartState] = useState<GuestCartItem[]>([]);
  const isGuest = !currentUser;

  const { data: customerData, refetch } =
    useGetSingleCustomerQuery(currentUser?._id as string, {
      skip: !currentUser?._id,
    });

  useEffect(() => {
    if (customerData) dispatch(setCustomer(customerData));
  }, [customerData, dispatch]);

  useEffect(() => {
    if (!currentUser) {
      setGuestCartState(getGuestCart());
    }
  }, [currentUser, isCartOpen]);

  // ================= GUEST =================
  const removeFromGuestCart = (
    productId: string,
    color: string,
    size: string
  ) => {
    const updated = guestCart.filter(
      (i) =>
        !(i.productId === productId && i.color === color && i.size === size)
    );
    setGuestCart(updated);
    setGuestCartState(updated);
    toast.success("Removed from cart!");
  };

  const handleGuestQuantityChange = (
    productId: string,
    color: string,
    size: string,
    type: "inc" | "dec"
  ) => {
    const updated = guestCart.map((i) =>
      i.productId === productId && i.color === color && i.size === size
        ? {
            ...i,
            quantity:
              type === "inc"
                ? i.quantity + 1
                : Math.max(i.quantity - 1, 1),
          }
        : i
    );

    setGuestCart(updated);
    setGuestCartState(updated);
  };

  // ================= USER =================
  const removeFromCart = async (id: string) => {
    if (!currentUser) return;

    try {
      setLoadingId(id);

      const updatedProductInfo = cartItems
        .filter((item: any) => !item.productId[0]?._id.includes(id))
        .map((item: any) => item);

      await updateCustomer({
        id: currentUser._id,
        body: {
          cartItem: [
            {
              userId: currentUser._id,
              productInfo: updatedProductInfo.map((item: any) => ({
                productId: [String(item.productId[0]?._id)],
                quantity: item.quantity,
                totalAmount: item.totalAmount,
                color: item.color || "",
                size: item.size || "",
              })),
            },
          ],
        },
      });

      refetch();
      toast.success("Removed from cart!");
      setLoadingId(null);
    } catch {
      toast.error("Failed to remove");
      setLoadingId(null);
    }
  };

  const handleQuantityChange = async (
    productId: string,
    type: "inc" | "dec"
  ) => {
    if (!currentUser) return;

    const item = cartItems.find(
      (i) => i.productId[0]?._id === productId
    );
    if (!item) return;

    const newQuantity =
      type === "inc"
        ? item.quantity + 1
        : Math.max(item.quantity - 1, 1);

    dispatch(updateCartItemQuantity({ productId, type }));

    try {
      await updateCustomer({
        id: currentUser._id,
        body: {
          cartItem: [
            {
              userId: currentUser._id,
              productInfo: cartItems.map((i) => {
                if (i.productId[0]?._id === productId) {
                  return {
                    productId: [String(i.productId[0]?._id)],
                    quantity: newQuantity,
                    totalAmount: i.totalAmount,
                    color: i.color || "",
                    size: i.size || "",
                  };
                }

                return {
                  productId: [String(i.productId[0]?._id)],
                  quantity: i.quantity,
                  totalAmount: i.totalAmount,
                  color: i.color || "",
                  size: i.size || "",
                };
              }),
            },
          ],
        },
      });

      refetch();
    } catch {
      toast.error("Update failed");
    }
  };

  const guestTotal = guestCart.reduce(
    (acc, i) => acc + (i.salePrice || 0) * i.quantity,
    0
  );

  const overallTotal = cartItems.reduce(
    (acc, i) =>
      acc +
      (i.productId[0]?.productInfo?.salePrice || 0) * i.quantity,
    0
  );

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity
        ${
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* SIDEBAR */}
      <div
        className={`
          fixed z-50 bg-white shadow-xl flex flex-col

          /* MOBILE */
          bottom-0 left-0 right-0 w-full max-h-[85vh] rounded-t-3xl
          transition-transform duration-300 ease-in-out
          ${isCartOpen ? "translate-y-0" : "translate-y-full"}

          /* DESKTOP */
          md:top-0 md:bottom-0 md:left-auto md:right-0
          md:h-full md:w-full md:max-w-md md:rounded-none
          md:transition-transform md:duration-300 md:ease-in-out
          ${isCartOpen ? "md:translate-x-0" : "md:translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">
            Cart ({isGuest ? guestCart.length : cartItems.length})
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isGuest ? (
            guestCart.length === 0 ? (
              <p className="text-center text-gray-400">
                Cart is empty
              </p>
            ) : (
              guestCart.map((item, idx) => (
                <div key={idx} className="flex gap-3 border-b pb-3">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <Image
                      src={item.featuredImg || "/placeholder.png"}
                      alt="product"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {item.name}
                    </h3>
                    <p className="text-sm">৳{item.salePrice}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          handleGuestQuantityChange(
                            item.productId,
                            item.color,
                            item.size,
                            "dec"
                          )
                        }
                      >
                        <Minus size={14} />
                      </Button>

                      <span>{item.quantity}</span>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          handleGuestQuantityChange(
                            item.productId,
                            item.color,
                            item.size,
                            "inc"
                          )
                        }
                      >
                        <Plus size={14} />
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() =>
                          removeFromGuestCart(
                            item.productId,
                            item.color,
                            item.size
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productId[0]?._id}
                className="flex gap-3 border-b pb-3"
              >
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image
                    src={
                      item.productId[0]?.featuredImg ||
                      "/placeholder.png"
                    }
                    alt="product"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-medium">
                    {item.productId[0]?.description?.name}
                  </h3>

                  <p>
                    ৳
                    {
                      item.productId[0]?.productInfo
                        ?.salePrice
                    }
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(
                          item.productId[0]._id,
                          "dec"
                        )
                      }
                    >
                      <Minus size={14} />
                    </Button>

                    <span>{item.quantity}</span>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(
                          item.productId[0]._id,
                          "inc"
                        )
                      }
                    >
                      <Plus size={14} />
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() =>
                        removeFromCart(item.productId[0]._id)
                      }
                    >
                      {loadingId === item.productId[0]?._id ? (
                        <LoaderCircle className="animate-spin w-4 h-4" />
                      ) : (
                        "Remove"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t p-4">
          <div className="flex justify-between mb-3">
            <span>Total</span>
            <span className="font-bold">
              ৳
              {(isGuest ? guestTotal : overallTotal).toFixed(2)}
            </span>
          </div>

          <Link href="/dashboard/checkout">
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Checkout
            </Button>
          </Link>

          <Button
            className="w-full mt-2"
            variant="ghost"
            onClick={() => setIsCartOpen(false)}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </>
  );
}