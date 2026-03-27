/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LoaderCircle,
  ShoppingCart,
  X,
  Eye,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useGetSingleCustomerQuery,
  useUpdateCustomerMutation,
} from "@/redux/featured/customer/customerApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import Image from "next/image";
import toast from "react-hot-toast";
import Loading from "./loading";

export default function CustomerSync() {
  const router = useRouter();
  const [loadingProducts, setLoadingProducts] = useState<{
    [key: string]: boolean;
  }>({});

  const currentUser = useAppSelector(selectCurrentUser);

  const {
    data: Customer,
    isError,
    isLoading,
    error,
    refetch,
  } = useGetSingleCustomerQuery(currentUser?._id as string);

  const [updateCustomer] = useUpdateCustomerMutation();

  const deleteWishlist = async (product: any) => {
    try {
      const wishListIds =
        Customer?.wishlist?.map((item: any) => item._id) ?? [];

      const updatedWishlist = wishListIds.filter(
        (id: string) => String(id) !== String(product._id)
      );

      await updateCustomer({
        id: Customer._id,
        body: { wishlist: updatedWishlist },
      });

      refetch();

      toast.success("Removed from wishlist!", {
        icon: "🗑️",
      });
    } catch (error) {
      toast.error("Failed to remove from wishlist", {
        icon: "⚠️",
      });
    }
  };

  const handleAddToCart = async (product: any) => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    if (product.variants && product.variants.length > 0) {
      toast.error("Please select color and size first", {
        icon: "🎨",
      });
      router.push(`/product-details/${product._id}`);
      return;
    }

    setLoadingProducts((prev) => ({ ...prev, [product._id]: true }));

    const wishListIds =
      Customer?.wishlist?.map((item: any) => item._id) ?? [];

    const updatedWishlist = wishListIds.filter(
      (id: string) => String(id) !== String(product._id)
    );

    try {
      await updateCustomer({
        id: Customer._id,
        body: {
          cartItem: [
            {
              userId: currentUser._id,
              productInfo: [
                ...(Customer?.cartItem?.[0]?.productInfo?.map(
                  (item: any) => ({
                    productId: [String(item.productId[0]._id)],
                    quantity: item.quantity,
                    totalAmount: item.totalAmount,
                    color: item.color || "",
                    size: item.size || "",
                  })
                ) ?? []),
                {
                  productId: [String(product._id)],
                  quantity: 1,
                  totalAmount: product?.productInfo?.price || 0,
                  color: "",
                  size: "",
                },
              ],
            },
          ],
          wishlist: updatedWishlist,
        },
      });

      refetch();
      toast.success("Added to cart successfully!", {
        icon: "🛒",
      });
    } catch (error) {
      toast.error("Failed to add to cart", {
        icon: "⚠️",
      });
    } finally {
      setLoadingProducts((prev) => ({
        ...prev,
        [product._id]: false,
      }));
    }
  };

  const viewProductDetails = (productId: string) => {
    router.push(`/product-details/${productId}`);
  };

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Error: {JSON.stringify(error)}
      </p>
    );
  }

  if (isLoading) return <Loading />;

  return (
    <div className="w-full ">
      {/* Header */}
    <div className="p-6 rounded-2xl border border-gray-200 bg-linear-to-r from-orange-50 to-white">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Wishlist
            </h1>
            <p className="text-gray-600 text-sm">
              Save your favorite products and add them to cart anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Wishlist Grid */}
      {Customer?.wishlist && Customer.wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6  ">
          {Customer.wishlist.map((item: any) => (
            <Card
              key={item._id}
              className="relative rounded-3xl overflow-hidden border hover:shadow-xl transition duration-300 group"
            >
              {/* Remove Button */}
              <button
                onClick={() => deleteWishlist(item)}
                className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur p-1.5 rounded-full shadow hover:bg-red-100 transition"
              >
                <X className="w-4 h-4 text-gray-600 hover:text-red-600" />
              </button>

              {/* Image */}
              <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                <Image
                  src={item?.featuredImg}
                  alt={item?.description?.name || "Product"}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                  {item?.description?.name || "Unknown Product"}
                </h3>

                {item.variants?.length > 0 && (
                  <span className="inline-block mb-3 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {item.variants.length} Variants Available
                  </span>
                )}

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-gray-900">
                    ${item.productInfo?.price || 0}
                  </span>

                  {item.variants?.length > 0 ? (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                      onClick={() =>
                        viewProductDetails(item._id)
                      }
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Select
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                      onClick={() =>
                        handleAddToCart(item)
                      }
                      disabled={
                        loadingProducts[item._id]
                      }
                    >
                      {loadingProducts[item._id] ? (
                        <LoaderCircle className="w-4 h-4 animate-spin mr-1" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 mr-1" />
                      )}
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20">
          <ShoppingBag className="mx-auto w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mt-2">
            Start adding products you love ❤️
          </p>
          <Button
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6"
            onClick={() => router.push("/shop")}
          >
            Browse Products
          </Button>
        </div>
      )}
    </div>
  );
}