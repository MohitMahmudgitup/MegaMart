import React from "react";
import Image from "next/image";
import { ChevronRight, X } from "lucide-react";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";
import Link from "next/link";

interface PopupProductMobileProps {
    onClose: () => void;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const PopupProductMobile: React.FC<PopupProductMobileProps> = ({ onClose, setSearchQuery }) => {
    const { data, isLoading, error } = useGetAllProductsQuery({});

    if (isLoading) {
        return (
            <div className="bg-white w-full max-h-80 overflow-y-auto rounded-xl shadow-lg p-4 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Loading products...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-white w-full max-h-80 overflow-y-auto rounded-xl shadow-lg p-4 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Failed to load products</p>
            </div>
        );
    }

    const products = data.map((item: any) => ({
        id: item._id,
        name: item.description.name,
        image: item.featuredImg,
        link: `/product-details/${item._id}`,
    }));

    const handleProductClick = () => {
        onClose();
        setSearchQuery("");
    };

    return (
        <div className="bg-white w-full max-h-80 overflow-y-auto rounded-b-xl shadow-lg p-4">
            {/* Product List */}
            {products.length === 0 ? (
                <p className="text-center text-gray-400 text-sm mt-6">
                    No products available
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {products.map((product: any) => (
                        <Link
                            href={product.link}
                            key={product.id}
                            onClick={handleProductClick}
                            className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            {/* Image */}
                            <div className="w-12 h-12 relative flex-shrink-0">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>

                            {/* Name */}
                            <p className="ml-4 text-gray-700 font-medium text-sm truncate flex-1">
                                {product.name}
                            </p>

                            {/* Arrow */}
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PopupProductMobile;