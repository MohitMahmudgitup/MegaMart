"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Pencil, Trash2, Plus } from "lucide-react";
import BannerCreateUpdate from "./BannerModal";

export interface Banner {
  _id: string;
  image: string; 
  title?: string;
  subTitle?: string;
  buttonText?: string;
  discount?: number;
  isActive?: boolean;
}

interface BannerCardProps {
  banner: Banner | null;
  refetch?: () => void;
  onDelete?: (id: string) => void;
  fallbackImage?: string;
}

export function BannerCard({
  banner,
  refetch,
  onDelete,
  fallbackImage,
}: BannerCardProps) {
  const placeholder = fallbackImage || "https://via.placeholder.com/512x410";
  const [src, setSrc] = useState<string>(banner?.image || placeholder);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    // Reset image when banner changes
    setSrc(banner?.image || placeholder);
    setImageError(false);
  }, [banner, placeholder]);

  const handleImageError = () => {
    if (!imageError) {
      setSrc(placeholder);
      setImageError(true);
    }
  };

  return (
    <div className="relative group rounded-[20px] overflow-hidden h-full w-full bg-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image / placeholder */}
      {banner ? (
        <Image
          src={src}
          alt={banner.title || "Banner"}
          fill
          priority
          unoptimized
          onError={handleImageError}
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm font-medium">
          No Banner
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300 z-20">
        {banner ? (
          <>
            {/* Edit */}
            <BannerCreateUpdate type="edit" refetch={refetch} editBanner={banner}>
              <button
                type="button"
                className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-100 flex items-center gap-1 transition"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </BannerCreateUpdate>

            {/* Delete */}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(banner._id)}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-red-700 flex items-center gap-1 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </>
        ) : (
          // Add button for empty slots
          <BannerCreateUpdate refetch={refetch}>
            <button
              type="button"
              className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-100 flex items-center gap-1 transition"
            >
              <Plus className="w-4 h-4" />
              Add Banner
            </button>
          </BannerCreateUpdate>
        )}
      </div>

      {/* Banner info text */}
      {banner && (
        <>
          {(banner.title || banner.subTitle) && (
            <div className="absolute bottom-4 left-4 z-10 text-white drop-shadow">
              {banner.title && (
                <h3 className="font-bold text-lg leading-tight">{banner.title}</h3>
              )}
              {banner.subTitle && (
                <p className="text-sm opacity-90">{banner.subTitle}</p>
              )}
            </div>
          )}

          {banner.buttonText && (
            <button
              type="button"
              className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:scale-105 transition"
            >
              <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
