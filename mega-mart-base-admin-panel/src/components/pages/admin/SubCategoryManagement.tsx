"use client"
import React, { useState, useRef } from "react";
import { useCreateSubCategoryMutation } from "@/redux/featured/subcategories/subcategoryApi";

const SubCategoryManagement = () => {
  const [createSubCategory, { isLoading }] = useCreateSubCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    details: "",
    isFeatured: false,
  });

  const [image, setImage] = useState<File | null>(null);
  const [bannerImg, setBannerImg] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "banner"
  ) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "image") {
      setImage(file);
      setImagePreview(url);
    } else {
      setBannerImg(file);
      setBannerPreview(url);
    }
  };

  const clearImage = (type: "image" | "banner") => {
    if (type === "image") {
      setImage(null);
      setImagePreview(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    } else {
      setBannerImg(null);
      setBannerPreview(null);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...formData, image, bannerImg };
    try {
      const res = await createSubCategory(payload).unwrap();
      console.log("Created:", res);
      alert("SubCategory created successfully!");
      setFormData({ name: "", details: "", isFeatured: false });
      setImage(null);
      setBannerImg(null);
      setImagePreview(null);
      setBannerPreview(null);
    } catch (error: any) {
      console.error(error);
      alert(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">New SubCategory</h1>
          </div>
          <p className="text-slate-500 text-sm ml-11">Fill in the details to create a new subcategory</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

            {/* Basic Info Section */}
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Basic Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Running Shoes"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Details <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="details"
                    placeholder="Brief description of this subcategory..."
                    value={formData.details}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Images</h2>
              <div className="grid grid-cols-2 gap-4">

                {/* Thumbnail Image */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Thumbnail <span className="text-red-400">*</span>
                  </label>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "image")}
                    className="hidden"
                    required={!image}
                  />
                  {imagePreview ? (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                      <img
                        src={imagePreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="p-1.5 bg-white/90 rounded-lg text-slate-700 hover:bg-white transition"
                          title="Change"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.929l-3.414.914.914-3.414A4 4 0 019 13z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => clearImage("image")}
                          className="p-1.5 bg-white/90 rounded-lg text-red-500 hover:bg-white transition"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-xs truncate">
                        {image?.name}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-violet-400 hover:bg-violet-50 transition group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center transition">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-violet-500 transition font-medium">Upload image</span>
                    </button>
                  )}
                </div>

                {/* Banner Image */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Banner <span className="text-red-400">*</span>
                  </label>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "banner")}
                    className="hidden"
                    required={!bannerImg}
                  />
                  {bannerPreview ? (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          className="p-1.5 bg-white/90 rounded-lg text-slate-700 hover:bg-white transition"
                          title="Change"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.929l-3.414.914.914-3.414A4 4 0 019 13z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => clearImage("banner")}
                          className="p-1.5 bg-white/90 rounded-lg text-red-500 hover:bg-white transition"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-xs truncate">
                        {bannerImg?.name}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="w-full aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-violet-400 hover:bg-violet-50 transition group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center transition">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-violet-500 transition font-medium">Upload banner</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="p-6">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Settings</h2>
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${formData.isFeatured ? "bg-violet-600" : "bg-slate-200"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${formData.isFeatured ? "translate-x-5" : "translate-x-1"}`} />
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700">Featured</span>
                  <p className="text-xs text-slate-400">Show this subcategory in featured sections</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm shadow-sm shadow-violet-200"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create SubCategory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCategoryManagement;