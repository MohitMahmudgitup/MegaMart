"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, Store, ImageIcon } from "lucide-react";

type ShopImageUploaderProps = {
  formData?: any;
  setLogo: React.Dispatch<React.SetStateAction<File | null>>;
  setCover: React.Dispatch<React.SetStateAction<File | null>>;

};

export const ShopImageUploader = ({
  formData,
  setLogo,
  setCover,
}: ShopImageUploaderProps) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [coverPreview, setCoverPreview] = useState<string>("");

  // Set initial previews from formData
  useEffect(() => {
    if (formData?.logo && !logoPreview && !logoFile) {
      setLogoPreview(formData.logo);
    }
    if (formData?.coverImage && !coverPreview && !coverFile) {
      setCoverPreview(formData.coverImage);
    }
  }, [formData, logoPreview, coverPreview, logoFile, coverFile]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    setLogo(logoFile);
    setCover(coverFile);
  }, [logoFile, coverFile, setLogo, setCover]);

  return (
    <div
      className="relative w-full mb-5
     mx-auto"
    >
      {/* Cover Section */}
      <div className="relative h-48 sm:h-60 w-full rounded-lg overflow-hidden border shadow">
        {coverPreview ? (
          <Image
            src={coverPreview}
            alt="Shop Cover"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Change Cover Button */}
        <label className="absolute bottom-3 right-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="hidden"
          />
          <div className="bg-white/90 px-3 py-1 rounded-md shadow text-xs flex items-center gap-1 cursor-pointer hover:bg-white">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:flex">{coverPreview ? 'Change' : 'Upload'} Cover</span>
          </div>
        </label>
      </div>

      {/* Profile Logo */}
      <div className="absolute -bottom-5 max-md:left-0 md:right-[50%] md:translate-x-[50%] flex items-center gap-3">
        <div className="relative">
          {logoPreview ? (
            <Image
              src={logoPreview}
              alt="Shop Logo"
              width={100}
              height={100}
              className="h-28 w-28 rounded-full ring-4 ring-white object-cover shadow-lg"
            />
          ) : (
            <div className="h-28 w-28 rounded-full ring-4 ring-white bg-gray-100 flex items-center justify-center shadow-lg">
              <Store className="h-10 w-10 text-gray-400" />
            </div>
          )}

          {/* Change Logo Button */}
          <label className="absolute bottom-0 right-0">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <div className="bg-white p-1.5 rounded-full shadow cursor-pointer hover:bg-gray-100">
              <Upload className="h-4 w-4 text-gray-600" />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
