"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Grid, List, Filter } from "lucide-react";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";
import Link from "next/link";
import { ProductCollectionSkeleton } from "@/components/ProductCollection/ProductCollectionSkeleton";
// import { ProductCollectionSkeleton } from "./ProductCollectionSkeleton";

// Updated Product type to match API response
type Product = {
    _id: string;
    shopId: string;
    featuredImg: string;
    gallery: string[];
    video: string;
    description?: {
        name: string;
        slug: string;
        description: string;
        unit?: string;
        status?: string;
    };
    productInfo?: {
        price: number;
        salePrice: number;
        quantity: number;
        sku: string;
        status: string;
    };
    brandAndCategories?: {
        brand?: {
            _id: string;
            name: string;
            icon?: {
                name: string;
                url: string;
            };
        };
        categories?: {
            _id: string;
            name: string;
            slug: string;
            details?: string;
        }[];
        tags?: {
            _id: string;
            name: string;
            slug: string;
            details?: string;
        }[];
    };
    productType: string;
    createdAt: string;
    updatedAt: string;
};

// Extract unique brands and categories from API data
const extractBrands = (products: Product[]): string[] => {
    const brands = new Set<string>();
    products.forEach((product) => {
        if (product.brandAndCategories?.brand?.name) {
            brands.add(product.brandAndCategories.brand.name);
        }
    });
    return Array.from(brands);
};

const extractCategories = (products: Product[]): string[] => {
    const categories = new Set<string>();

    products.forEach((product) => {
        product.brandAndCategories?.categories?.forEach((cat) => {
            if (cat.name) {
                categories.add(cat.name);
            }
        });
    });
    return Array.from(categories);
};

const extractTags = (products: Product[]): string[] => {
    const tags = new Set<string>();
    products.forEach((product) => {
        product.brandAndCategories?.tags?.forEach((tag) => {
            if (tag.name) {
                tags.add(tag.name);
            }
        });
    });
    return Array.from(tags);
};

// Colors remain the same as they're not in API data
const colors = [
    { name: "Green", value: "#22c55e" },
    { name: "Yellow", value: "#eab308" },
    { name: "Orange", value: "#f97316" },
    { name: "Red", value: "#ef4444" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Gray", value: "#6b7280" },
    { name: "Black", value: "#000000" },
];

// Updated Filter Panel
type FilterPanelProps = {
    priceRange: number[];
    setPriceRange: (v: number[]) => void;
    selectedBrands: string[];
    handleBrandChange: (brand: string, checked: boolean) => void;
    selectedColors: string[];
    handleColorChange: (color: string, checked: boolean) => void;
    selectedCategories: string[];
    handleCategoryChange: (category: string, checked: boolean) => void;
    selectedTags: string[];
    handleTagChange: (tag: string, checked: boolean) => void;
    availableBrands: string[];
    availableCategories: string[];
    availableTags: string[];
    onClearAll?: () => void;
};

function FilterPanel({
    priceRange,
    setPriceRange,
    selectedBrands,
    handleBrandChange,
    selectedColors,
    handleColorChange,
    selectedCategories,
    handleCategoryChange,
    selectedTags,
    handleTagChange,
    availableBrands,
    availableCategories,
    availableTags,
    onClearAll,
}: FilterPanelProps) {
    return (
        <div className="space-y-6 ">
            {/* Categories Filter */}
            <Card className="">
                <CardContent className="p-4 ">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Categories</h3>
                        {onClearAll && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={onClearAll}
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                    <div className="mt-4 space-y-3 max-h-40 overflow-y-auto">
                        {availableCategories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`cat-${category}`}
                                    checked={selectedCategories.includes(category)}
                                    onCheckedChange={(checked) =>
                                        handleCategoryChange(category, Boolean(checked))
                                    }
                                />
                                <label
                                    htmlFor={`cat-${category}`}
                                    className="text-sm capitalize"
                                >
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Price Range Filter */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Price Range</h3>
                    <div className="space-y-4">
                        <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={1000}
                            step={10}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>BDT{priceRange[0]}.00</span>
                            <span>BDT{priceRange[1]}.00</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Brands Filter */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Brands</h3>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                        {availableBrands.map((brand) => (
                            <div key={brand} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`brand-${brand}`}
                                    checked={selectedBrands.includes(brand)}
                                    onCheckedChange={(checked) =>
                                        handleBrandChange(brand, Boolean(checked))
                                    }
                                />
                                <label htmlFor={`brand-${brand}`} className="text-sm">
                                    {brand}
                                </label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tags Filter */}
            {availableTags.length > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Tags</h3>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                            {availableTags.map((tag) => (
                                <div key={tag} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`tag-${tag}`}
                                        checked={selectedTags.includes(tag)}
                                        onCheckedChange={(checked) =>
                                            handleTagChange(tag, Boolean(checked))
                                        }
                                    />
                                    <label htmlFor={`tag-${tag}`} className="text-sm">
                                        {tag}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Colors Filter (kept for potential future use) */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Colors</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {colors.map((color) => {
                            const active = selectedColors.includes(color.name);
                            return (
                                <button
                                    key={color.name}
                                    onClick={() => handleColorChange(color.name, !active)}
                                    className={`w-8 h-8 rounded-full border-2 ${active
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-gray-300"
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                    aria-label={color.name}
                                />
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
export function CollectionList({ onClose, searchQuery }: any) {
    const { data, isLoading, error } = useGetAllProductsQuery({});
    const [productData, setProductData] = useState<Product[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState<
        "popular" | "price-low" | "price-high" | "newest"
    >("popular");

    // Extract dynamic filter options
    const availableBrands = useMemo(
        () => extractBrands(productData),
        [productData]
    );
    const availableCategories = useMemo(
        () => extractCategories(productData),
        [productData]
    );
    const availableTags = useMemo(() => extractTags(productData), [productData]);

    useEffect(() => {
        if (data) {
            setProductData(data);
        }
    }, [data]);

    // Handlers
    const handleBrandChange = (brand: string, checked: boolean) => {
        setSelectedBrands((prev) =>
            checked ? [...prev, brand] : prev.filter((b) => b !== brand)
        );
    };

    const handleColorChange = (color: string, checked: boolean) => {
        setSelectedColors((prev) =>
            checked ? [...prev, color] : prev.filter((c) => c !== color)
        );
    };

    const handleCategoryChange = (category: string, checked: boolean) => {
        setSelectedCategories((prev) =>
            checked ? [...prev, category] : prev.filter((c) => c !== category)
        );
    };

    const handleTagChange = (tag: string, checked: boolean) => {
        setSelectedTags((prev) =>
            checked ? [...prev, tag] : prev.filter((t) => t !== tag)
        );
    };

    const handleClearAll = () => {
        setSelectedBrands([]);
        setSelectedColors([]);
        setSelectedCategories([]);
        setSelectedTags([]);
        const prices = productData.map(
            (p: Product) => p.productInfo?.salePrice || p.productInfo?.price || 0
        );
        const maxPrice = Math.max(...prices, 1000);
        setPriceRange([0, Math.ceil(maxPrice / 100) * 100]);
    };

    // Filtering logic updated for API data structure
    const filteredProducts = useMemo(() => {
        return productData.filter((product) => {
            const salePrice = product.productInfo?.salePrice || 0;
            const regularPrice = product.productInfo?.price || 0;
            const price = salePrice > 0 ? salePrice : regularPrice;

            // Price filter
            const priceInRange = price >= priceRange[0] && price <= priceRange[1];

            // Brand filter
            const brand = product.brandAndCategories?.brand?.name || "";
            const brandMatch =
                selectedBrands.length === 0 || selectedBrands.includes(brand);

            // Category filter
            const productCategories =
                product.brandAndCategories?.categories?.map((cat) => cat.name) || [];
            const categoryMatch =
                selectedCategories.length === 0 ||
                selectedCategories.some((selectedCat) =>
                    productCategories.includes(selectedCat)
                );

            // Tags filter
            const productTags =
                product.brandAndCategories?.tags?.map((tag) => tag.name) || [];
            const tagMatch =
                selectedTags.length === 0 ||
                selectedTags.some((selectedTag) => productTags.includes(selectedTag));

            // Color filter (always true since no color data in API)
            const colorMatch = selectedColors.length === 0;

            return (
                priceInRange && brandMatch && categoryMatch && tagMatch && colorMatch
            );
        });
    }, [
        productData,
        priceRange,
        selectedBrands,
        selectedCategories,
        selectedTags,
        selectedColors,
    ]);

    const searchQueryProducts = data?.filter((product: any) => {
    const name = product.description?.name || "";
    const description = product.description?.description || "";
    if (!searchQuery) return true; // show all if no query
    return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase())
    );
}) || [];


    // Sorting logic
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];

        switch (sortBy) {
            case "price-low":
                return sorted.sort((a, b) => {
                    const priceA = a.productInfo?.salePrice || a.productInfo?.price || 0;
                    const priceB = b.productInfo?.salePrice || b.productInfo?.price || 0;
                    return priceA - priceB;
                });
            case "price-high":
                return sorted.sort((a, b) => {
                    const priceA = a.productInfo?.salePrice || a.productInfo?.price || 0;
                    const priceB = b.productInfo?.salePrice || b.productInfo?.price || 0;
                    return priceB - priceA;
                });
            case "newest":
                return sorted.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            case "popular":
            default:
                return sorted;
        }
    }, [filteredProducts, sortBy]);

    if (isLoading) {
        return <ProductCollectionSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-red-500">
                        Error loading products. Please try again.
                    </p>
                </div>
            </div>
        );
    }
    

    return (
        <div className="min-h-screen bg-background  p-4 lg:p-6">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row justify-between gap-2">
                    {/* Desktop Left Sidebar */}
                    <aside className="hidden lg:block lg:w-60  self-start">
                        <FilterPanel
                            priceRange={priceRange}
                            setPriceRange={(v) => setPriceRange([v[0], v[1]])}
                            selectedBrands={selectedBrands}
                            handleBrandChange={handleBrandChange}
                            selectedColors={selectedColors}
                            handleColorChange={handleColorChange}
                            selectedCategories={selectedCategories}
                            handleCategoryChange={handleCategoryChange}
                            selectedTags={selectedTags}
                            handleTagChange={handleTagChange}
                            availableBrands={availableBrands}
                            availableCategories={availableCategories}
                            availableTags={availableTags}
                            onClearAll={handleClearAll}
                        />
                    </aside>

                    {/* Main Content */}
                    <div className="2xl:ml-2 flex-1">

                        {/* Products Grid */}
                        {searchQueryProducts.length > 0 && data ? (
                            <div
                                className={`md:bg-white block md:grid md:p-4 md:rounded-lg gap-2 md:gap-6 ${viewMode === "grid"
                                    ? "columns-2 md:columns-none md:grid-cols-3"
                                    : "columns-1"
                                    }`}
                            >

                                {searchQueryProducts.map((product : any) => (
                                    <Card
                                        key={product._id}
                                        className={`overflow-hidden mb-2 md:md-0  border transition-shadow hover:shadow-sm   ${viewMode === "list" ? "sm:flex" : ""}`}
                                    >
                                        <div
                                            className={`w-full   ${viewMode === "list"
                                                ? "sm:flex sm:items-stretch"
                                                : "flex flex-col"
                                                }`}
                                        >
                                            {/* Image */}
                                            <div
                                                className={`relative  bg-gray-100 ${viewMode === "list"
                                                    ? "sm:w-56 sm:h-56 w-full aspect-square"
                                                    : "w-full aspect-square"
                                                    }`}
                                            >
                                                <Image
                                                    src={product.featuredImg || "/placeholder-product.jpg"}
                                                    alt={product.description?.name || "Product"}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                                                />
                                            </div>

                                            {/* Content */}
                                            <CardContent
                                                className={`flex flex-col justify-between gap-4 p-2    ${viewMode === "list" ? "sm:w-full" : ""} `}
                                            >
                                                {/* Info */}
                                                <div>
                                                    <h3 className="text-sm font-medium line-clamp-2 mb-2">
                                                        {product.description?.name || "Unnamed Product"}
                                                    </h3>

                                                    <div className="flex items-center gap-2">
                                                        {product.productInfo?.salePrice &&
                                                            product.productInfo.salePrice > 0 ? (
                                                            <>
                                                                <span className="text-lg font-bold">
                                                                    BDT {product.productInfo.salePrice.toFixed(2)}
                                                                </span>
                                                                {product.productInfo.price &&
                                                                    product.productInfo.price >
                                                                    product.productInfo.salePrice && (
                                                                        <span className="text-sm text-muted-foreground line-through">
                                                                            BDT {product.productInfo.price.toFixed(2)}
                                                                        </span>
                                                                    )}
                                                            </>
                                                        ) : (
                                                            <span className="text-lg font-bold">
                                                                BDT {(product.productInfo?.price || 0).toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-3">
                                                    {/* VIEW */}
                                                    <Link
                                                        href={`/product-details/${product._id}`}
                                                        className="w-full sm:w-auto"
                                                        onClick={onClose}
                                                    >
                                                        <Button className="w-full bg-black px-3">
                                                            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-500 to-blue-500">
                                                                VIEW
                                                            </span>
                                                        </Button>
                                                    </Link>

                                                    {/* ADD TO CART */}
                                                    <Button
                                                        size="sm"
                                                        disabled={product.productInfo?.quantity === 0}
                                                        className="w-full sm:w-auto border bg-[#F5F6F6] text-black font-semibold hover:bg-gray-200 disabled:opacity-50"
                                                    >
                                                        {product.productInfo?.quantity === 0
                                                            ? "OUT OF STOCK"
                                                            : "ADD TO CART"}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>

                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-lg text-muted-foreground">
                                    No products found matching your filters.
                                </p>
                                <Button onClick={handleClearAll} className="mt-4">
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
