/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Heart,
  Minus,
  Plus,
  Shield,
  Truck,
  Undo2,
  Star,
  ShoppingCart,
  Copy,
  ClipboardCheck,
  LoaderCircle,
} from "lucide-react";
import { useGetAllProductsQuery, useGetSingleProductQuery } from "@/redux/featured/product/productApi";
import {
  useCreateCustomerMutation,
  useGetSingleCustomerQuery,
  useUpdateCustomerMutation,
} from "@/redux/featured/customer/customerApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useRouter } from "next/navigation";
import { current } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import clsx from "clsx";
import {
  setCustomer,
} from "@/redux/featured/customer/customerSlice";
import Link from "next/link";
import { ProductDetailsSkeleton } from "@/components/ProductDetailsSkeleton";
import SectionHeader from "@/components/modules/home/new-arrivals/SectionHeader";

function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type ProductImage = { src: string; alt: string };
type ColorOption = { name: string; };
type SizeOption = string;
type Variant = {
  color: string;
  size: string;
  price: number;
  stock: number;
};

export default function ProductDetailsPage({ productId }: any) {
  const whyRef = useRef<HTMLDivElement | null>(null);
  const specRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const voucherRef = useRef<HTMLDivElement | null>(null);
  const relatedRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (ref: any, offset = 0) => {
    if (ref.current) {
      const top = ref.current.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };
  const [isWLoading, setIsWLoading] = useState(false);
  const [isaddLoading, setIsaddLoading] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [viewAllText, setViewAllText] = useState(false);
  const dispatch = useAppDispatch();
  const [updateCustomer] = useUpdateCustomerMutation();
  const router = useRouter();
  const { data: currentProduct, isLoading } = useGetSingleProductQuery(productId)
  const { data: productsData } = useGetAllProductsQuery({});



  const currentUser = useAppSelector(selectCurrentUser);

  const { data: singleCustomer, refetch: refetchCustomer } =
    useGetSingleCustomerQuery(currentUser?._id as string);

  useEffect(() => {
    if (singleCustomer) {
      dispatch(setCustomer(singleCustomer));
    }
  }, [singleCustomer, dispatch]);

  // Extract unique colors and sizes from variants
  const variants: Variant[] = useMemo(() => {
    return currentProduct?.variants || [];
  }, [currentProduct?.variants]);

  const colors: ColorOption[] = useMemo(() => {
    const uniqueColors = Array.from(new Set(variants.map(v => v.color)));
    return uniqueColors.map(color => ({ name: color, hex: undefined }));
  }, [variants]);

  const sizes: SizeOption[] = useMemo(() => {
    const uniqueSizes = Array.from(new Set(variants.map(v => v.size)));
    return uniqueSizes;
  }, [variants]);

  const [mainIdx, setMainIdx] = useState(0);
  const [color, setColor] = useState<ColorOption | null>(null);
  const [size, setSize] = useState<SizeOption | null>(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<null | {
    type: "cart" | "wish";
    text: string;
  }>(null);



  const images: ProductImage[] = useMemo(() => {
    if (!currentProduct) {
      return [
        {
          src: "/placeholder.png",
          alt: "Product placeholder",
        },
      ];
    }

    const imageList = [];

    // Add featured image
    if (currentProduct.featuredImg) {
      imageList.push({
        src: currentProduct.featuredImg,
        alt: currentProduct.description?.name || "Product image",
      });
    }

    // Add gallery images
    if (currentProduct.gallery && currentProduct.gallery.length > 0) {
      currentProduct.gallery.forEach((img: string, index: number) => {
        imageList.push({
          src: img,
          alt: `${currentProduct.description?.name || "Product"} - Image ${index + 2
            }`,
        });
      });
    }

    if (imageList.length === 0) {
      imageList.push({
        src: "/placeholder.png",
        alt: "Product placeholder",
      });
    }

    return imageList;
  }, [currentProduct]);

  // Get selected variant
  const selectedVariant = useMemo(() => {
    if (!color || !size || variants.length === 0) return null;
    return variants.find(v => v.color === color.name && v.size === size) || null;
  }, [color, size, variants]);

  // Get available sizes for selected color
  const availableSizes = useMemo(() => {
    if (!color) return sizes;
    return Array.from(new Set(
      variants
        .filter(v => v.color === color.name)
        .map(v => v.size)
    ));
  }, [color, variants, sizes]);

  // Get available colors (show all colors, not filtered by size)
  const availableColors = useMemo(() => {
    return colors;
  }, [colors]);

  const product = useMemo(() => {
    if (!currentProduct) {
      return {
        title: "Loading...",
        description: "Loading product details...",
        shortdescription: "Loading product details...",
        price: 0,
        compareAt: 0,
        rating: 4.8,
        reviews: 0,
        sold: 0,
        badges: [] as const,
        brand: "",
        categories: [],
        tags: [],
        specifications: {
          sku: "",
          weight: "",
          dimensions: {
            length: "",
            width: "",
            height: "",
          },
          status: "",
          quantity: 0,
        },
      };
    }

    // Use variant price if available, otherwise use product info price
    const variantPrice = selectedVariant?.price;
    const salePrice = variantPrice ?? currentProduct.productInfo?.salePrice ?? 0;
    const regularPrice = currentProduct.productInfo?.price || salePrice;

    const compareAtPrice =
      regularPrice > salePrice ? regularPrice : salePrice * 1.3;

    // Use variant stock if available, otherwise use product info quantity
    const stock = selectedVariant?.stock ?? currentProduct.productInfo?.quantity ?? 0;

    return {
      title: currentProduct.description?.name || "Untitled Product",
      description:
        currentProduct.description?.description || "No description available",
      shortdescription: currentProduct.description?.shortdescription || "No description available",
      price: salePrice,
      compareAt: compareAtPrice,
      rating: 3,
      reviews: 0,
      sold: 0,
      badges: [
        ...(salePrice < regularPrice ? ["SALE"] : []),
        ...(stock > 0
          ? ["In Stock"]
          : ["Out of Stock"]),
        ...(stock < 10 && stock > 0
          ? ["Limited Edition"]
          : []),
      ] as const,
      brand: currentProduct.brandAndCategories?.brand?.name || "",
      categories: currentProduct.brandAndCategories?.categories || [],
      tags: currentProduct.brandAndCategories?.tags || [],
      specifications: {
        sku: currentProduct.productInfo?.sku || "",
        weight: "450g",
        dimensions: {
          length: currentProduct.productInfo?.length || "",
          width: currentProduct.productInfo?.width || "",
          height: currentProduct.productInfo?.height || "",
        },
        status: currentProduct.productInfo?.status || "",
        quantity: stock,
      },
    };
  }, [currentProduct, selectedVariant]);

  const discountPct = useMemo(() => {
    if (product.compareAt <= product.price) return 0;
    const diff = product.compareAt - product.price;

    return Math.round((diff / product.compareAt) * 100);
  }, [product.compareAt, product.price]);

  const relatedProducts = useMemo(() => {
    if (!productsData || productsData.length <= 1 || !currentProduct) return [];
    return productsData
      .filter((p: any) => p._id !== currentProduct._id)
      .slice(0, 4)
      .map((p: any) => ({
        id: p._id,
        name: p.description?.name || "Untitled Product",
        image: p.featuredImg || "/placeholder.png",
        price: `${p.productInfo?.salePrice || 0}`,
        oldPrice:
          p.productInfo?.price && p.productInfo.price > p.productInfo.salePrice
            ? `${p.productInfo.price}`
            : undefined,
        sold: Math.floor(Math.random() * 500) + 50,
      }));
  }, [productsData, currentProduct]);

  // ---- Static data for vouchers and reviews (you can make these dynamic too) ----
  const vouchers = [
    {
      label: "20%",
      labelColor: "bg-[#0E1F34] text-white",
      title: "20% Off",
      description: "Get 20% off on orders above $100",
      minPurchase: "$100",
      expires: "2024-12-31",
      code: "SAVE20",
    },
    {
      label: "Free ",
      labelColor: "bg-emerald-500 text-white",
      title: "Free Shipping",
      description: "Free shipping on orders above $50",
      minPurchase: "$50",
      expires: "2024-12-31",
      code: "FREESHIP",
    },
  ];

  const reviews = [
    {
      name: "John Mitchell",
      rating: 5,
      date: "2024-01-15",
      review:
        "Excellent quality! The fit is perfect and the material feels premium. Worth every penny!",
    },
    {
      name: "Sarah Williams",
      rating: 4,
      date: "2024-01-12",
      review:
        "Great product, love the quality and style. The delivery was quick and packaging was excellent.",
    },
  ];

  // ---- handlers ----
  const handleQty = (dir: "dec" | "inc") =>
    setQty((q) => {
      const next = dir === "inc" ? q + 1 : q - 1;
      const maxQty = Math.min(10, product.specifications.quantity || 1);
      return Math.min(maxQty, Math.max(1, next));
    });

  const isVariantOutOfStock = selectedVariant && selectedVariant.stock === 0;

  const addToCart = async () => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    // Check if variants exist and color/size are not selected
    if (currentProduct?.variants && currentProduct.variants.length > 0) {
      if (!color || !size) {
        toast.error("Please select color and size before adding to cart");
        return;
      }
    }

    setIsaddLoading(true);
    try {
      const res = await updateCustomer({
        id: singleCustomer._id,
        body: {
          cartItem: [
            {
              userId: currentUser._id,
              productInfo: [
                ...(singleCustomer?.cartItem?.[0]?.productInfo?.map(
                  (item: any) => ({
                    productId: [String(item.productId[0]._id)],
                    quantity: item.quantity,
                    totalAmount: item.totalAmount,
                    color: item.color,
                    size: item.size
                  })
                ) ?? []),
                {
                  productId: [String(currentProduct?._id)],
                  quantity: qty,
                  totalAmount: currentProduct?.productInfo?.price || 0,
                  color: color?.name || '',
                  size: size || ''
                },
              ],
            },
          ],
        },
      });
      setIsaddLoading(false);
      refetchCustomer();
      toast.success("Added to cart successfully!");
      setMessage({ type: "cart", text: "Added to cart successfully!" });
    } catch (error) {

    }
  };

  const toggleWishlist = async () => {
    setIsWLoading(true);

    try {
      const res = await updateCustomer({
        id: singleCustomer._id,
        body: {
          wishlist: [
            ...(singleCustomer?.wishlist?.map((item: any) => item._id) ?? []),
            String(currentProduct?._id),
          ],
        },
      });
      await refetchCustomer();
      toast.success("Added to Wishlist");
      setIsWLoading(false);
    } catch (error) { }
  };

  const removeWishlist = async () => {
    try {
      setIsWLoading(true);

      const updatedWishlist =
        singleCustomer?.wishlist?.filter(
          (item: any) => String(item._id) !== String(currentProduct?._id)
        ) ?? [];

      const res = await updateCustomer({
        id: singleCustomer._id,
        body: {
          wishlist: updatedWishlist,
        },
      });
      await refetchCustomer();
      toast.success("Removed from Wishlist");
      setIsWLoading(false);
    } catch (error) { }
  };

  const isAddedToCart = useMemo(() => {
    if (!singleCustomer?.cartItem?.[0]?.productInfo || !currentProduct?._id) {
      return false;
    }

    return singleCustomer.cartItem[0].productInfo.some((item: any) =>
      item.productId.some(
        (p: any) => (typeof p === "string" ? p : p._id) === currentProduct._id
      )
    );
  }, [singleCustomer, currentProduct]);

  const isAddedToWishlist = useMemo(() => {
    if (!singleCustomer?.wishlist || !currentProduct?._id) {
      return false;
    }

    return singleCustomer.wishlist.some(
      (item: any) => item._id === currentProduct._id
    );
  }, [singleCustomer, currentProduct]);

  if (isLoading) return <ProductDetailsSkeleton />;
  const productDescription = product.description.length

  return (
    <div className="max-w-full mx-auto 2xl:px-0 md:px-8 px-2">
      {showZoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md">
          {/* Zoomed image */}
          <div className="relative max-w-3xl w-full p-4">
            <Image
              src={images[mainIdx]?.src || "/placeholder.png"}
              alt={images[mainIdx]?.alt || "Product image"}
              width={800}
              height={800}
              className="object-contain rounded-xl"
            />

            {/* Cancel / Close button */}
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-700 shadow-md hover:bg-white/100 hover:scale-110 transition-all duration-200"
              aria-label="Close zoom"
            >
              ✕
            </button>

          </div>
        </div>

      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT: media */}
        <div className="">
          {/* Main image */}
          <div
            onClick={() => setShowZoom(true)}
            className="relative cursor-pointer aspect-square rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200"
          >
            <Image
              src={images[mainIdx]?.src || "/placeholder.png"}
              alt={images[mainIdx]?.alt || "Product image"}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 600px"
              priority
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={img.src + i}
                  onClick={() => {
                    setMainIdx(i);
                    setShowZoom(true);
                  }}
                  aria-label={`Show image ${i + 1}`}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden ring-1 transition",
                    mainIdx === i
                      ? "ring-orange-500"
                      : "ring-gray-200 hover:ring-gray-300"
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>


        {/* RIGHT: details */}
        <div className="bg-white rounded-lg p-6 border ">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            {product.badges.includes("SALE") && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white">
                SALE
              </span>
            )}
            {product.badges.includes("In Stock") && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-green-600 text-green-700">
                In Stock
              </span>
            )}
            {product.badges.includes("Out of Stock") && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-red-600 text-red-700">
                Out of Stock
              </span>
            )}
            {product.badges.includes("Limited Edition") && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-400 text-amber-400">
                Limited Edition
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl md:text-3xl font-bold line-clamp-1">{product.title}</h1>
          </div>
          <div className="relative">
            <p
              className={`text-gray-600 text-sm mt-2 ${viewAllText ? "" : "line-clamp-3"
                }`}
              dangerouslySetInnerHTML={{ __html: product?.shortdescription || "" }}
            />

            {product?.shortdescription?.length > 200 && (
              <span
                onClick={() => setViewAllText(!viewAllText)}
                className="text-zinc-500 cursor-pointer absolute -bottom-4 right-2 px-3 py-1 rounded-full text-xs hover:bg-gray-200"
              >
                {viewAllText ? "view less" : "view all"}
              </span>
            )}
          </div>


          {/* Brand and categories */}
          {(product.brand || product.categories.length > 0) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              {/* {product.brand && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Brand: {product.brand}
                </span>
              )} */}
              {product.categories.map((category: any) => (
                <span
                  key={category._id}
                  className="bg-blue-50 px-2 py-1 rounded text-blue-700"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* rating row */}
          <div className="flex items-center gap-2 mt-3">
            <Stars value={product.rating} />
            <span className="text-sm text-gray-600">
              ({product.reviews} reviews)
            </span>
            <span className="text-sm text-green-600">
              • {product.sold.toLocaleString()} sold
            </span>
          </div>

          {/* price row */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-semibold text-[#FF5724] flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#FF5724]">৳</span>
              {product.price.toFixed(2)}
            </span>

            {discountPct > 0 && (
              <>
                <span className="text-gray-400 line-through">
                  ৳{product.compareAt.toFixed(2)}
                </span>
                <span className="text-xs font-bold rounded-full px-3 py-1 bg-red-600 text-white">
                  {discountPct}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock information */}
          <div className="mt-3 text-sm text-gray-600">
            {selectedVariant ? (
              <span>
                {selectedVariant.stock} items available
                {product.specifications.sku &&
                  ` • SKU: ${product.specifications.sku}`}
              </span>
            ) : product.specifications.quantity > 0 ? (
              <span>
                {product.specifications.quantity} items available
                {product.specifications.sku &&
                  ` • SKU: ${product.specifications.sku}`}
              </span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </div>

          {/* color picker */}
          {colors.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium">Color: {color?.name || "Not selected"}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {availableColors.map((c) => {
                  const isAvailable = variants.some(v => v.color === c.name && v.stock > 0);
                  return (
                    <button
                      key={c.name}
                      aria-label={c.name}
                      aria-pressed={c.name === color?.name}
                      onClick={() => setColor(c)}
                      disabled={!isAvailable}
                      className={cn(
                        "px-3 py-2 rounded-md border text-sm transition",
                        c.name === color?.name
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                        !isAvailable && "opacity-50 cursor-not-allowed line-through"
                      )}
                      title={!isAvailable ? "Out of stock" : c.name}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* size picker */}
          {sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium">Size: {size || "Not selected"}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSizes.map((s) => {
                  const isAvailable = variants.some(v => v.size === s && v.stock > 0);
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      disabled={!isAvailable}
                      className={cn(
                        "min-w-10 px-3 py-2 rounded-md border text-sm transition",
                        s === size
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                        !isAvailable && "opacity-50 cursor-not-allowed line-through"
                      )}
                      title={!isAvailable ? "Out of stock" : s}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* quantity */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQty("dec")}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center">{qty}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQty("inc")}
                disabled={qty >= Math.min(10, product.specifications.quantity)}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* actions */}
          <div className="mt-6 space-y-2">

            <div className={`grid  gap-2 ${currentProduct?.variants?.length > 0 && (!color || !size) ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <Button
                onClick={addToCart}
                disabled={product.specifications.quantity === 0 || isAddedToCart || currentProduct.variants.length > 0 && (!color || !size) || isVariantOutOfStock}
                className={clsx(
                  "w-full text-white",
                  {
                    "bg-gray-500 hover:bg-gray-600":
                      product.specifications.quantity === 0 || isVariantOutOfStock, // stock out
                    "bg-green-600 hover:bg-green-600 text-black": isAddedToCart, // already added
                    "bg-orange-500 hover:bg-orange-600":
                      product.specifications.quantity > 0 && !isAddedToCart && !isVariantOutOfStock, // normal add
                  }
                )}
              >
                {isaddLoading ? (
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4 mr-2" />
                )}

                {currentProduct?.variants?.length > 0 && (!color || !size)
                  ? "Select Color & Size"
                  : product.specifications.quantity === 0 || isVariantOutOfStock
                    ? "Out of Stock"
                    : isAddedToCart
                      ? "Added to Cart"
                      : "Add to Cart"}
              </Button>

              {
                currentProduct?.variants?.length > 0 && (!color || !size) ? (null) :
                  (
                    <Link href="/dashboard/checkout">
                      <Button
                        onClick={addToCart}
                        disabled={product.specifications.quantity === 0 || isAddedToCart || currentProduct.variants.length > 0 && (!color || !size) || isVariantOutOfStock}
                        className={clsx(
                          "w-full text-white",
                          {
                            "bg-gray-500 hover:bg-gray-600":
                              product.specifications.quantity === 0 || isVariantOutOfStock, // stock out
                            "bg-green-600 hover:bg-green-600 text-black": isAddedToCart, // already added
                            "bg-blue-500 hover:bg-blue-600":
                              product.specifications.quantity > 0 && !isAddedToCart && !isVariantOutOfStock, // normal add
                          }
                        )}
                      >
                        {isaddLoading ? (
                          <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ClipboardCheck className="w-4 h-4 mr-2" />
                        )}

                        {currentProduct?.variants?.length > 0 && (!color || !size)
                          ? "Select Color & Size"
                          : product.specifications.quantity === 0 || isVariantOutOfStock
                            ? "Out of Stock"
                            : isAddedToCart
                              ? "Added to Cart"
                              : "Buy Now"}
                      </Button>
                    </Link>
                  )
              }


            </div>
            <Button
              variant="outline"
              onClick={isAddedToWishlist ? removeWishlist : toggleWishlist}
              className={cn(
                "w-full justify-center",
                isAddedToWishlist && "border-pink-300 bg-pink-50 text-pink-700"
              )}
            >
              {isWLoading ? (
                <Heart className={cn("mr-2 h-4 w-4 animate-ping")} />
              ) : (
                <Heart
                  className={cn(
                    "mr-2 h-4 w-4",
                    isAddedToWishlist && "fill-current"
                  )}
                />
              )}
              {isAddedToWishlist ? "Remove to Wishlist" : "Add to Wishlist"}
            </Button>
            {isAddedToWishlist && (
              <p role="status" className={cn("text-sm pt-1 text-pink-700")}>
                Added to wishlist
              </p>
            )}
          </div>

          {/* guarantees */}
          <div className="flex justify-center flex-wrap items-center gap-8 text-sm text-gray-600 mt-6">
            <div className="flex flex-col items-center gap-2">
              <Truck className="w-7 h-7" /> First Shipping
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-7 h-7" /> 2 Year Warranty
            </div>
            <div className="flex flex-col items-center gap-2">
              <Undo2 className="w-7 h-7" /> Easy Returns
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 mt-20 px-4 py-3 bg-white border rounded-lg sticky top-20 z-20 ">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-4 py-2 rounded-lg  bg-amber-600 text-white  hover:bg-zinc-700 hover:text-white transition"
          onClick={() => scrollToSection(whyRef, -100)}
        >
          Why Choose
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-4 py-2 rounded-lg  bg-amber-600 text-white  hover:bg-zinc-700 hover:text-white transition"
          onClick={() => scrollToSection(specRef, -100)}
        >
          Specifications
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-zinc-700 hover:text-white transition"
          onClick={() => scrollToSection(reviewRef, -100)}
        >
          Reviews
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-4 py-2 rounded-lg   bg-amber-600 text-white hover:bg-zinc-700 hover:text-white transition"
          onClick={() => scrollToSection(voucherRef, -100)}
        >
          Vouchers
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-4 py-2 rounded-lg  bg-amber-600 text-white  hover:bg-zinc-700 hover:text-white transition"
          onClick={() => scrollToSection(relatedRef, -100)}
        >
          Related
        </Button>
      </div>

      {/* WHY CHOOSE */}
      <div ref={whyRef} className="mt-10">
        <h2 className="text-lg md:text-xl font-bold mb-4">
          Why Choose this {product.title}?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border p-6 rounded-lg ">
          <WhyCard
            icon={<Shield className="w-6 h-6" />}
            title="Premium Quality"
            desc="Made with high-quality materials and crafted with attention to detail for long-lasting durability."
          />
          <WhyCard
            icon={<Star className="w-6 h-6" />}
            title="Verified Reviews"
            desc={`Rated ${product.rating}/5 stars by ${product.reviews} verified customers who love this product.`}
          />
          <WhyCard
            icon={<Heart className="w-6 h-6" />}
            title="Customer Favorite"
            desc={`Over ${product.sold.toLocaleString()} satisfied customers. Join the community who trust our products!`}
          />
        </div>
      </div>

      <div ref={specRef} className="space-y-4 mt-10">
        <h2 className="text-xl font-semibold">Specifications</h2>
        <Card className="p-4 border">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-0">
            {/* Product Details */}
            <div>
              <h3 className="font-semibold mb-3">Product Details</h3>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {product.specifications.sku && (
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">SKU</td>
                      <td className="py-2 font-semibold">
                        {product.specifications.sku}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b">
                    <td className="py-2 text-gray-500">Status</td>
                    <td className="py-2 capitalize">
                      {product.specifications.status || "Available"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-500">Stock</td>
                    <td className="py-2">
                      {product.specifications.quantity} units
                    </td>
                  </tr>
                  {product.specifications.weight && (
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">Weight</td>
                      <td className="py-2">{product.specifications.weight}</td>
                    </tr>
                  )}
                  {(product.specifications.dimensions.length ||
                    product.specifications.dimensions.width ||
                    product.specifications.dimensions.height) && (
                      <tr className="border-b">
                        <td className="py-2 text-gray-500">Dimensions</td>
                        <td className="py-2">
                          {[
                            product.specifications.dimensions.length &&
                            `L: ${product.specifications.dimensions.length}`,
                            product.specifications.dimensions.width &&
                            `W: ${product.specifications.dimensions.width}`,
                            product.specifications.dimensions.height &&
                            `H: ${product.specifications.dimensions.height}`,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </td>
                      </tr>
                    )}
                  {product.brand && (
                    <tr className="border-b">
                      <td className="py-2 text-gray-500">Brand</td>
                      <td className="py-2 font-semibold">{product.brand}</td>
                    </tr>
                  )}
                  {product.tags.length > 0 && (
                    <tr>
                      <td className="py-2 text-gray-500">Tags</td>
                      <td className="py-2">
                        {product.tags.map((tag: any) => tag.name).join(", ")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Features & Benefits + Care Instructions */}
            <div className="space-y-5">
              {/* Features */}
              <div>

                <h3 className="font-semibold mb-3">Features & Benefits</h3>
                <p
                  className={`text-gray-600 text-sm mt-2 `}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />

              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Reviews */}
      <div ref={reviewRef} className="space-y-4 mt-10">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <Card key={index} className="border rounded-lg">
              <CardContent className="p-4">
                {/* Name, Stars & Date */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{review.name}</span>
                  <div className="flex items-center text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating
                          ? "fill-yellow-500"
                          : "fill-gray-200"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>

                {/* Review Text */}
                <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {review.review}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Vouchers */}
      <div ref={voucherRef} className="w-full mx-auto mt-10">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">🔷</span> Available Vouchers
        </h2>

        <div className="space-y-3">
          {vouchers.map((voucher, idx) => (
            <Card key={idx} className="rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between">
                {/* Left Side */}
                <div className="flex items-center flex-1 p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${voucher.labelColor}`}
                  >
                    {voucher.label}
                  </span>
                  <div className="ml-4">
                    <h3 className="font-semibold">{voucher.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {voucher.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>Min. purchase: {voucher.minPurchase}</span>
                      <span>⏳ Expires: {voucher.expires}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex justify-between md:flex-col items-center md:justify-center p-4 w-full sm:w-32 border-t sm:border-t-0 sm:border-l border-gray-200 sm:border-dashed">
                  <span className="font-bold text-lg">{voucher.code}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 flex items-center gap-1"
                    onClick={() => navigator.clipboard.writeText(voucher.code)}
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div ref={relatedRef} className="w-full bg-white p-6 rounded-lg border mx-auto mt-8">
          <SectionHeader
            title="New Arrivals"

            viewAllLinkState={true}
          />

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {relatedProducts.map((product: any) => (
              <Card
                key={product.id}
                className="p-3 rounded-xl border border-gray-200 hover:shadow-sm transition cursor-pointer"
              >
                <Link href={`/product-details/${product.id}`}>
                  {/* Image */}
                  <div className="relative w-full h-40 mb-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="w-full h-full"
                    />
                  </div>

                  {/* Name */}
                  <div className="flex flex-col">
                    <h3 className="text-[16px] font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-orange-600 font-semibold">
                        {product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          {product.oldPrice}
                        </span>
                      )}
                    </div>

                    {/* Sold */}
                    <span className="text-gray-500 text-xs mt-1">
                      {product.sold} sold
                    </span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------- Helpers --------- */

function Stars({ value }: { value: number }) {
  // render 5 stars with partial fill
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <svg
            key={i}
            className={cn(
              "w-4 h-4",
              filled ? "text-yellow-500" : "text-gray-300"
            )}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

function WhyCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="border rounded-xl p-5 text-center">
      <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}
