/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

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
  Package,
  Tag,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useGetAllProductsQuery, useGetSingleProductQuery } from "@/redux/featured/product/productApi";
import { useGetSingleCustomerQuery, useUpdateCustomerMutation } from "@/redux/featured/customer/customerApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import clsx from "clsx";
import { setCustomer } from "@/redux/featured/customer/customerSlice";
import Link from "next/link";
import { ProductDetailsSkeleton } from "@/components/ProductDetailsSkeleton";
import NewArrivals from "@/components/modules/home/new-arrivals/NewArrivals";

function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type ProductImage = { src: string; alt: string };
type ColorOption = { name: string };
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
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiperIndex, setMainSwiperIndex] = useState(0);
  const mainSwiperRef = useRef<SwiperType | null>(null);

  const dispatch = useAppDispatch();
  const [updateCustomer] = useUpdateCustomerMutation();
  const router = useRouter();
  const { data: currentProduct, isLoading } = useGetSingleProductQuery(productId);
  const { data: productsData } = useGetAllProductsQuery({});

  const currentUser = useAppSelector(selectCurrentUser);
  const { data: singleCustomer, refetch: refetchCustomer } =
    useGetSingleCustomerQuery(currentUser?._id as string);

  useEffect(() => {
    if (singleCustomer) {
      dispatch(setCustomer(singleCustomer));
    }
  }, [singleCustomer, dispatch]);

  const variants: Variant[] = useMemo(() => currentProduct?.variants || [], [currentProduct?.variants]);

  const colors: ColorOption[] = useMemo(() => {
    const uniqueColors = Array.from(new Set(variants.map((v) => v.color)));
    return uniqueColors.map((color) => ({ name: color, hex: undefined }));
  }, [variants]);

  const sizes: SizeOption[] = useMemo(() => {
    const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)));
    return uniqueSizes;
  }, [variants]);

  const [color, setColor] = useState<ColorOption | null>(null);
  const [size, setSize] = useState<SizeOption | null>(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<null | { type: "cart" | "wish"; text: string }>(null);

  const images: ProductImage[] = useMemo(() => {
    if (!currentProduct)
      return [{ src: "/placeholder.png", alt: "Product placeholder" }];

    const imageList = [];
    if (currentProduct.featuredImg)
      imageList.push({ src: currentProduct.featuredImg, alt: currentProduct.description?.name || "Product image" });

    if (currentProduct.gallery?.length > 0)
      currentProduct.gallery.forEach((img: string, index: number) =>
        imageList.push({ src: img, alt: `${currentProduct.description?.name || "Product"} - Image ${index + 2}` })
      );

    if (imageList.length === 0)
      imageList.push({ src: "/placeholder.png", alt: "Product placeholder" });

    return imageList;
  }, [currentProduct]);

  const selectedVariant = useMemo(() => {
    if (!color || !size || variants.length === 0) return null;
    return variants.find((v) => v.color === color.name && v.size === size) || null;
  }, [color, size, variants]);

  const availableSizes = useMemo(() => {
    if (!color) return sizes;
    return Array.from(new Set(variants.filter((v) => v.color === color.name).map((v) => v.size)));
  }, [color, variants, sizes]);

  const availableColors = useMemo(() => colors, [colors]);

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
        specifications: { sku: "", weight: "", dimensions: { length: "", width: "", height: "" }, status: "", quantity: 0 },
      };
    }

    const variantPrice = selectedVariant?.price;
    const salePrice = variantPrice ?? currentProduct.productInfo?.salePrice ?? 0;
    const regularPrice = currentProduct.productInfo?.price || salePrice;
    const compareAtPrice = regularPrice > salePrice ? regularPrice : salePrice * 1.3;
    const stock = selectedVariant?.stock ?? currentProduct.productInfo?.quantity ?? 0;

    return {
      title: currentProduct.description?.name || "Untitled Product",
      description: currentProduct.description?.description || "No description available",
      shortdescription: currentProduct.description?.shortdescription || "No description available",
      price: salePrice,
      compareAt: compareAtPrice,
      rating: 3,
      reviews: 0,
      sold: 0,
      badges: [
        ...(salePrice < regularPrice ? ["SALE"] : []),
        ...(stock > 0 ? ["In Stock"] : ["Out of Stock"]),
        ...(stock < 10 && stock > 0 ? ["Limited Edition"] : []),
      ] as any,
      brand: currentProduct.brandAndCategories?.brand?.name || "",
      categories: currentProduct.brandAndCategories?.categories || [],
      tags: currentProduct.brandAndCategories?.tags || [],
      specifications: {
        sku: currentProduct.productInfo?.sku || "",
        dimensions: {
          length: currentProduct.productInfo?.length || "",
          width: currentProduct.productInfo?.width || "",
          height: currentProduct.productInfo?.height || "",
        },
        status: currentProduct.productInfo?.status || "",
        quantity: stock,
      },
      specificationsList: currentProduct.specifications || [],
    };
  }, [currentProduct, selectedVariant]);

  const discountPct = useMemo(() => {
    if (product.compareAt <= product.price) return 0;
    return Math.round(((product.compareAt - product.price) / product.compareAt) * 100);
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

  const vouchers = [
    { label: "20%", labelColor: "bg-[#0E1F34] text-white", title: "20% Off", description: "Get 20% off on orders above $100", minPurchase: "$100", expires: "2024-12-31", code: "SAVE20" },
    { label: "Free ", labelColor: "bg-emerald-500 text-white", title: "Free Shipping", description: "Free shipping on orders above $50", minPurchase: "$50", expires: "2024-12-31", code: "FREESHIP" },
  ];

  const reviews = [
    { name: "John Mitchell", rating: 5, date: "2024-01-15", review: "Excellent quality! The fit is perfect and the material feels premium. Worth every penny!" },
    { name: "Sarah Williams", rating: 4, date: "2024-01-12", review: "Great product, love the quality and style. The delivery was quick and packaging was excellent." },
  ];

  const handleQty = (dir: "dec" | "inc") =>
    setQty((q) => {
      const next = dir === "inc" ? q + 1 : q - 1;
      const maxQty = Math.min(10, product.specifications.quantity || 1);
      return Math.min(maxQty, Math.max(1, next));
    });

  const isVariantOutOfStock = selectedVariant && selectedVariant.stock === 0;

  const addToCart = async () => {
    if (!currentUser) { router.push("/auth/login"); return; }
    if (currentProduct?.variants && currentProduct.variants.length > 0) {
      if (!color || !size) { toast.error("Please select color and size before adding to cart"); return; }
    }
    setIsaddLoading(true);
    try {
      await updateCustomer({
        id: singleCustomer._id,
        body: {
          cartItem: [{
            userId: currentUser._id,
            productInfo: [
              ...(singleCustomer?.cartItem?.[0]?.productInfo?.map((item: any) => ({
                productId: [String(item.productId[0]._id)],
                quantity: item.quantity,
                totalAmount: item.totalAmount,
                color: item.color,
                size: item.size,
              })) ?? []),
              { productId: [String(currentProduct?._id)], quantity: qty, totalAmount: currentProduct?.productInfo?.price || 0, color: color?.name || "", size: size || "" },
            ],
          }],
        },
      });
      setIsaddLoading(false);
      refetchCustomer();
      toast.success("Added to cart successfully!");
      setMessage({ type: "cart", text: "Added to cart successfully!" });
    } catch (error) {}
  };

  const toggleWishlist = async () => {
    setIsWLoading(true);
    try {
      await updateCustomer({
        id: singleCustomer._id,
        body: { wishlist: [...(singleCustomer?.wishlist?.map((item: any) => item._id) ?? []), String(currentProduct?._id)] },
      });
      await refetchCustomer();
      toast.success("Added to Wishlist");
      setIsWLoading(false);
    } catch (error) {}
  };

  const removeWishlist = async () => {
    try {
      setIsWLoading(true);
      const updatedWishlist = singleCustomer?.wishlist?.filter((item: any) => String(item._id) !== String(currentProduct?._id)) ?? [];
      await updateCustomer({ id: singleCustomer._id, body: { wishlist: updatedWishlist } });
      await refetchCustomer();
      toast.success("Removed from Wishlist");
      setIsWLoading(false);
    } catch (error) {}
  };

  const isAddedToCart = useMemo(() => {
    if (!singleCustomer?.cartItem?.[0]?.productInfo || !currentProduct?._id) return false;
    return singleCustomer.cartItem[0].productInfo.some((item: any) =>
      item.productId.some((p: any) => (typeof p === "string" ? p : p._id) === currentProduct._id)
    );
  }, [singleCustomer, currentProduct]);

  const isAddedToWishlist = useMemo(() => {
    if (!singleCustomer?.wishlist || !currentProduct?._id) return false;
    return singleCustomer.wishlist.some((item: any) => item._id === currentProduct._id);
  }, [singleCustomer, currentProduct]);

  if (isLoading) return <ProductDetailsSkeleton />;

  const needsVariantSelection = currentProduct?.variants?.length > 0 && (!color || !size);
  const isOutOfStock = product.specifications.quantity === 0 || isVariantOutOfStock;

  return (
    <div className="max-w-full mx-auto 2xl:px-0 md:px-8 px-3 pb-16">

      {/* ───── Breadcrumb ───── */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 py-4 mb-2">
        <span className="hover:text-gray-600 cursor-pointer transition-colors">Home</span>
        <span>/</span>
        {product.categories[0] && (
          <>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">{product.categories[0].name}</span>
            <span>/</span>
          </>
        )}
        <span className="text-gray-600 font-medium line-clamp-1 max-w-[200px]">{product.title}</span>
      </nav>

      {/* ───── Main Grid ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-10">

        {/* ── LEFT: Image Gallery ── */}
        <div className="space-y-3">
          {/* Main Image */}
          <div
            onClick={() => setShowZoom(true)}
            className="relative cursor-zoom-in rounded-2xl overflow-hidden bg-gray-50 border border-gray-100"
            style={{ aspectRatio: "1 / 1" }}
          >
            {/* Discount Badge */}
            {discountPct > 0 && (
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  -{discountPct}%
                </span>
              </div>
            )}

            {/* Stock Badge */}
            <div className="absolute top-3 right-3 z-10">
              {product.badges.includes("In Stock") ? (
                <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            <Swiper
              modules={[Navigation, Thumbs, FreeMode]}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              onSwiper={(swiper) => { mainSwiperRef.current = swiper; }}
              onSlideChange={(swiper) => setMainSwiperIndex(swiper.activeIndex)}
              navigation={images.length > 1 ? { nextEl: ".next-btn", prevEl: ".prev-btn" } : false}
              loop={false}
              className="w-full h-full"
              style={{ width: "100%", height: "100%" }}
            >
              {images.map((img, i) => (
                <SwiperSlide key={img.src + i} style={{ width: "100%", height: "100%" }}>
                  <div className="relative w-full h-full">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 600px" priority={i === 0} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <Swiper
              modules={[Thumbs, FreeMode]}
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={5}
              freeMode={true}
              watchSlidesProgress={true}
              className="thumbs-swiper"
            >
              {images.map((img, i) => (
                <SwiperSlide key={img.src + i}>
                  <button
                    aria-label={`Show image ${i + 1}`}
                    className={cn(
                      "relative w-full rounded-xl overflow-hidden transition-all duration-200 block border-2",
                      mainSwiperIndex === i
                        ? "border-orange-400 shadow-sm scale-[1.02]"
                        : "border-transparent hover:border-gray-300"
                    )}
                    style={{ aspectRatio: "1/1" }}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* ── RIGHT: Product Info ── */}
        <div className="flex flex-col gap-5">

          {/* Title & Categories */}
          <div>
            {product.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {product.categories.map((cat: any) => (
                  <span key={cat._id} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-bold text-gray-900 leading-tight text-xl sm:text-2xl xl:text-3xl">
              {product.title}
            </h1>
            {product.brand && (
              <p className="text-sm text-gray-500 mt-1">
                by <span className="font-semibold text-gray-700">{product.brand}</span>
              </p>
            )}
          </div>

          {/* Rating Row */}
          <div className="flex items-center gap-3 text-sm">
            <Stars value={product.rating} />
            <span className="text-gray-500">({product.reviews} reviews)</span>
            {product.sold > 0 && (
              <span className="text-green-600 font-medium">✓ {product.sold.toLocaleString()} sold</span>
            )}
          </div>

          {/* Price Block */}
          <div className="flex items-center gap-3 py-4 px-5 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-orange-500">৳</span>
              <span className="text-3xl font-bold text-orange-500">{product.price.toFixed(2)}</span>
            </div>
            {discountPct > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through text-base">৳{product.compareAt.toFixed(2)}</span>
                <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">{discountPct}% OFF</span>
              </div>
            )}
          </div>

          {/* Short Description */}
          <div className="text-sm text-gray-600 leading-relaxed relative">
            <div
              className={cn("prose prose-sm max-w-none", !viewAllText && "line-clamp-3")}
              dangerouslySetInnerHTML={{ __html: product?.shortdescription || "" }}
            />
            {product?.shortdescription?.length > 200 && (
              <button
                onClick={() => setViewAllText(!viewAllText)}
                className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-600 mt-1 transition-colors"
              >
                {viewAllText ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Show more</>}
              </button>
            )}
          </div>

          {/* Stock Info */}
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-gray-400" />
            {selectedVariant ? (
              <span className={selectedVariant.stock > 0 ? "text-green-600" : "text-red-500"}>
                {selectedVariant.stock > 0 ? `${selectedVariant.stock} units available` : "This variant is out of stock"}
              </span>
            ) : product.specifications.quantity > 0 ? (
              <span className="text-green-600">{product.specifications.quantity} units available</span>
            ) : (
              <span className="text-red-500 font-medium">Out of stock</span>
            )}
            {product.specifications.sku && (
              <span className="text-gray-400 text-xs ml-2">SKU: {product.specifications.sku}</span>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Color Picker */}
          {colors.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2.5">
                Color: {color ? <span className="font-normal text-gray-600">{color.name}</span> : <span className="font-normal text-gray-400">Select a color</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((c) => {
                  const isAvailable = variants.some((v) => v.color === c.name && v.stock > 0);
                  return (
                    <button
                      key={c.name}
                      aria-label={c.name}
                      aria-pressed={c.name === color?.name}
                      onClick={() => setColor(c)}
                      disabled={!isAvailable}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border",
                        c.name === color?.name
                          ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                          : isAvailable
                          ? "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                          : "opacity-40 cursor-not-allowed line-through bg-gray-50 border-gray-200 text-gray-400"
                      )}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Picker */}
          {sizes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2.5">
                Size: {size ? <span className="font-normal text-gray-600">{size}</span> : <span className="font-normal text-gray-400">Select a size</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((s) => {
                  const isAvailable = variants.some((v) => v.size === s && v.stock > 0);
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      disabled={!isAvailable}
                      className={cn(
                        "min-w-[44px] px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border",
                        s === size
                          ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                          : isAvailable
                          ? "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                          : "opacity-40 cursor-not-allowed line-through bg-gray-50 border-gray-200 text-gray-400"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2.5">Quantity</p>
            <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
              <button
                onClick={() => handleQty("dec")}
                disabled={qty <= 1}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-semibold text-gray-800">{qty}</span>
              <button
                onClick={() => handleQty("inc")}
                disabled={qty >= Math.min(10, product.specifications.quantity)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {needsVariantSelection ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Please select color &amp; size to continue
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {/* Add to Cart */}
                <button
                  onClick={addToCart}
                  disabled={isOutOfStock || isAddedToCart}
                  className={clsx(
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm",
                    {
                      "bg-gray-200 text-gray-500 cursor-not-allowed": isOutOfStock,
                      "bg-green-100 text-green-700 border border-green-300 cursor-not-allowed": isAddedToCart,
                      "bg-orange-500 hover:bg-orange-600 active:scale-95 text-white": !isOutOfStock && !isAddedToCart,
                    }
                  )}
                >
                  {isaddLoading ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : isAddedToCart ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  {isOutOfStock ? "Out of Stock" : isAddedToCart ? "In Cart" : "Add to Cart"}
                </button>

                {/* Buy Now */}
                <Link href="/dashboard/checkout" className="block">
                  <button
                    onClick={addToCart}
                    disabled={isOutOfStock || isAddedToCart}
                    className={clsx(
                      "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm",
                      {
                        "bg-gray-200 text-gray-500 cursor-not-allowed": isOutOfStock,
                        "bg-green-100 text-green-700 border border-green-300 cursor-not-allowed": isAddedToCart,
                        "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white": !isOutOfStock && !isAddedToCart,
                      }
                    )}
                  >
                    {isaddLoading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <ClipboardCheck className="w-4 h-4" />}
                    {isOutOfStock ? "Unavailable" : isAddedToCart ? "Added" : "Buy Now"}
                  </button>
                </Link>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={isAddedToWishlist ? removeWishlist : toggleWishlist}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200",
                isAddedToWishlist
                  ? "bg-pink-50 border-pink-300 text-pink-600 hover:bg-pink-100"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {isWLoading ? (
                <Heart className="w-4 h-4 animate-ping" />
              ) : (
                <Heart className={cn("w-4 h-4 transition-all", isAddedToWishlist && "fill-pink-500 text-pink-500")} />
              )}
              {isAddedToWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: <Truck className="w-5 h-5" />, label: "Fast Shipping", color: "text-blue-500 bg-blue-50" },
              { icon: <Shield className="w-5 h-5" />, label: "2 Year Warranty", color: "text-green-500 bg-green-50" },
              { icon: <Undo2 className="w-5 h-5" />, label: "Easy Returns", color: "text-purple-500 bg-purple-50" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", item.color)}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-gray-600 leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Sticky Nav ───── */}
      <div className="mt-8 z-30 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm sticky top-4">
        <div className="px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
            {[
              { label: "Why Choose", ref: whyRef, active: true },
              { label: "Specifications", ref: specRef, active: false },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.ref, -100)}
                className={cn(
                  "flex-shrink-0 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200",
                  item.active
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Why Choose ───── */}
      <div ref={whyRef} className="mt-10">
        <SectionTitle>Why Choose {product.title}?</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <WhyCard
            icon={<Shield className="w-6 h-6 text-blue-500" />}
            iconBg="bg-blue-50"
            title="Premium Quality"
            desc="Made with high-quality materials and crafted with attention to detail for long-lasting durability."
          />
          <WhyCard
            icon={<Star className="w-6 h-6 text-amber-500" />}
            iconBg="bg-amber-50"
            title="Verified Reviews"
            desc={`Rated ${product.rating}/5 stars by ${product.reviews} verified customers who love this product.`}
          />
          <WhyCard
            icon={<Heart className="w-6 h-6 text-pink-500" />}
            iconBg="bg-pink-50"
            title="Customer Favorite"
            desc={`Over ${product.sold.toLocaleString()} satisfied customers trust our products.`}
          />
        </div>
      </div>

      {/* ───── Specifications ───── */}
      <div ref={specRef} className="mt-10">
        <SectionTitle>Specifications</SectionTitle>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Product Details Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-800 text-sm">Product Details</h3>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-50">
                {product.specifications.sku && (
                  <SpecRow label="SKU" value={product.specifications.sku} />
                )}
                <SpecRow label="Status" value={product.specifications.status || "Available"} capitalize />
                <SpecRow label="Stock" value={`${product.specifications.quantity} units`} />
                {(product.specifications.dimensions.length || product.specifications.dimensions.width || product.specifications.dimensions.height) && (
                  <SpecRow
                    label="Dimensions"
                    value={[
                      product.specifications.dimensions.length && `L: ${product.specifications.dimensions.length}`,
                      product.specifications.dimensions.width && `W: ${product.specifications.dimensions.width}`,
                      product.specifications.dimensions.height && `H: ${product.specifications.dimensions.height}`,
                    ].filter(Boolean).join(", ")}
                  />
                )}
                {product.brand && <SpecRow label="Brand" value={product.brand} />}
                {product.tags.length > 0 && (
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-5 text-gray-500 font-medium w-1/3">Tags</td>
                    <td className="py-3 px-5">
                      <div className="flex flex-wrap gap-1.5">
                        {product.tags.map((tag: any, i: number) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
                {product.specificationsList?.map((spec: any, index: number) => (
                  <SpecRow key={index} label={spec.key} value={spec.value} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Features & Benefits */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-800 text-sm">Features &amp; Benefits</h3>
            </div>
            <div className="p-5">
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ───── Related Products ───── */}
      <div className="mt-12">
        <NewArrivals />
      </div>
    </div>
  );
}

/* ─── Helpers ─── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-3">
      <span className="w-1 h-6 rounded-full bg-orange-400 inline-block" />
      {children}
    </h2>
  );
}

function SpecRow({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="py-3 px-5 text-gray-500 font-medium w-1/3 text-sm">{label}</td>
      <td className={cn("py-3 px-5 text-gray-800 font-medium text-sm", capitalize && "capitalize")}>{value}</td>
    </tr>
  );
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <svg key={i} className={cn("w-4 h-4", filled ? "text-yellow-400" : "text-gray-200")} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

function WhyCard({ icon, iconBg, title, desc }: { icon: React.ReactNode; iconBg: string; title: string; desc: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:shadow-sm transition-shadow duration-200">
      <div className={cn("mx-auto mb-3 w-12 h-12 rounded-2xl flex items-center justify-center", iconBg)}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 text-sm mb-1.5">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}