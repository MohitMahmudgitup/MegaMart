"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { AiOutlinePrinter } from "react-icons/ai";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/shared/Select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCreateCouponMutation } from "@/redux/featured/coupons/coupons";

interface CouponFormData {
  code: string;
  description: string;
  type: "fixed" | "percentage";
  discountAmount: string;
  minimumOrderAmount: string;
  maximumDiscount: string;
  usageLimit: string;
  isActive: boolean;
  activeDate: string;
  expireDate: string;
}

const AddNewCoupons = () => {
  const router = useRouter();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    description: "",
    type: "fixed",
    discountAmount: "",
    minimumOrderAmount: "0",
    maximumDiscount: "",
    usageLimit: "",
    isActive: true,
    activeDate: "",
    expireDate: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      type: val.includes("Percentage") ? "percentage" : "fixed",
    }));
  };

  const generateCouponCode = () => {
    const prefix = "SAVE";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, code: `${prefix}${randomNum}` }));
  };

  const validateForm = (): boolean => {
    if (!formData.code.trim()) {
      toast.error("Coupon code is required!");
      return false;
    }

    if (!formData.expireDate) {
      toast.error("Expire date is required!");
      return false;
    }

    if (Number(formData.discountAmount) <= 0) {
      toast.error("Discount amount must be greater than 0!");
      return false;
    }

    if (formData.type === "percentage" && Number(formData.discountAmount) > 100) {
      toast.error("Percentage discount cannot exceed 100%!");
      return false;
    }

    if (formData.activeDate && formData.expireDate) {
      if (new Date(formData.activeDate) >= new Date(formData.expireDate)) {
        toast.error("Active date must be before expire date!");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim(),
      type: formData.type,
      discountAmount: Number(formData.discountAmount),
      minimumOrderAmount: Number(formData.minimumOrderAmount) || 0,
      maximumDiscount: formData.maximumDiscount
        ? Number(formData.maximumDiscount)
        : undefined,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      isActive: formData.isActive,
      activeDate: formData.activeDate || undefined,
      expireDate: formData.expireDate,
      // Admin-specific fields
      ownerType: "admin" as const,
      scope: "global" as const,
    };

    try {
      await createCoupon(payload).unwrap();
      toast.success("Coupon created successfully!");
      router.push("/admin/coupons");
    } catch (error: any) {
      console.error("Error creating coupon:", error);
      toast.error(error?.data?.message || "Failed to create coupon!");
    }
  };

  return (
    <div className="p-2 md:p-4 lg:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/admin/coupons"
            className="flex items-center text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            <IoMdArrowBack className="mr-1" /> Back to Coupons
          </Link>
          <h2 className="text-2xl font-semibold">Add New Coupon</h2>
        </div>
        <button
          onClick={handleSubmit}
          type="button"
          className="text-white bg-black px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <AiOutlinePrinter /> {isLoading ? "Saving..." : "Save Coupon"}
        </button>
      </div>

      {/* Main Form */}
      <div className="flex flex-col lg:flex-row gap-6">
        <form
          onSubmit={handleSubmit}
          className="border p-4 md:p-6 lg:p-8 bg-white rounded-xl flex-1"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-semibold text-xl mb-1">Coupon Details</h2>
              <p className="text-gray-400 text-sm">
                Create a new promotional coupon code.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
              <span className="text-xs font-medium text-blue-700">Global Coupon</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <strong>Note:</strong> As an admin, you're creating a global coupon that can be used across all shops in the marketplace.
          </p>

          <div className="space-y-4">
            {/* Coupon Code */}
            <div>
              <label className="block mb-1 font-semibold">Coupon Code*</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g., SAVE2024"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  required
                />
                <button
                  type="button"
                  className="border border-gray-200 px-3 py-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors whitespace-nowrap"
                  onClick={generateCouponCode}
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border p-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what this coupon offers (optional)"
              />
            </div>

            {/* Discount Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block mb-1 font-semibold">Discount Type*</label>
                <Select
                  options={["Fixed", "% Percentage"]}
                  value={formData.type === "fixed" ? "Fixed" : "% Percentage"}
                  onChange={handleTypeChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">
                  Discount Amount* {formData.type === "percentage" && "(Max 100%)"}
                </label>
                <input
                  name="discountAmount"
                  value={formData.discountAmount}
                  onChange={handleChange}
                  placeholder={formData.type === "fixed" ? "150" : "10"}
                  type="number"
                  min="0"
                  max={formData.type === "percentage" ? "100" : undefined}
                  step={formData.type === "percentage" ? "0.01" : "1"}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Order & Max Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block mb-1 font-semibold">Minimum Order Amount</label>
                <input
                  name="minimumOrderAmount"
                  value={formData.minimumOrderAmount}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                  min="0"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">
                  Maximum Discount {formData.type === "fixed" && "(Not applicable for fixed)"}
                </label>
                <input
                  name="maximumDiscount"
                  value={formData.maximumDiscount}
                  onChange={handleChange}
                  placeholder="150"
                  type="number"
                  min="0"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={formData.type === "fixed"}
                />
              </div>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Active Date</label>
                <input
                  type="date"
                  name="activeDate"
                  value={formData.activeDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to activate immediately</p>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Expire Date*</label>
                <input
                  type="date"
                  name="expireDate"
                  value={formData.expireDate}
                  onChange={handleChange}
                  min={formData.activeDate || new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded mt-4 hover:bg-gray-800 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        </form>

        {/* Sidebar */}
        <div className="flex flex-col gap-6 w-full lg:w-[320px]">
          <div className="border p-5 bg-white rounded-lg space-y-5">
            {/* Usage Limit */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Usage Limit</h2>
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Maximum Uses (optional)
                </label>
                <input
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  placeholder="Leave empty for unlimited"
                  type="number"
                  min="1"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Set how many times this coupon can be used
                </p>
              </div>
            </div>

            {/* Coupon Status */}
            <div className="pt-3 border-t">
              <h2 className="font-semibold text-lg mb-3">Coupon Status</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Active</h3>
                  <p className="text-xs text-gray-500">
                    {formData.isActive ? "Coupon is active" : "Coupon is inactive"}
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(val: boolean) =>
                    setFormData((prev) => ({ ...prev, isActive: val }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewCoupons;
