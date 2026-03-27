"use client";

import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import {
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
  useUpdateCouponMutation,
  Coupon,
} from "@/redux/featured/coupons/coupons";

const StatusBadge = ({ status }: { status: string }) => {
  const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
  const statusStyles = {
    active: "bg-green-100 text-green-600",
    expired: "bg-red-100 text-red-600",
    inactive: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`${baseClass} ${statusStyles[status as keyof typeof statusStyles] || statusStyles.inactive}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useGetVendorByUserIdQuery } from "@/redux/featured/vendor/vendorApi";
import { useGetMyShopQuery } from "@/redux/featured/shop/shopApi";

const CouponsManageVendor = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const userId = currentUser?._id;

  const { data: thisVendor, isLoading: vendorLoading } = useGetVendorByUserIdQuery(userId!, {
    skip: !userId,
  });

  const { data: myshopData, isLoading: shopsLoading } = useGetMyShopQuery(thisVendor?._id!, {
    skip: !thisVendor?._id,
  });

  const thisVendorShops = myshopData?.shops || [];
  const vendorShopIds = thisVendorShops.map((shop: any) => shop._id);

  const { data, isLoading, isError, refetch } = useGetAllCouponsQuery();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  // Filter coupons to show only vendor's shop coupons
  const allCoupons: Coupon[] = Array.isArray(data) ? data : [];
  const coupons = allCoupons.filter(
    (coupon) => coupon.shopId && vendorShopIds.includes(coupon.shopId)
  );

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const handleEditClick = (coupon: Coupon) => {
    setSelectedCoupon({ ...coupon });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      await deleteCoupon(deleteModal.id).unwrap();
      refetch()
      toast.success("Coupon deleted successfully!");
      setDeleteModal({ open: false, id: null });
    } catch (err: any) {
      console.error("Delete failed:", err);
      toast.error(err?.data?.message || "Failed to delete coupon");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoupon?._id) return;

    try {
      await updateCoupon({
        id: selectedCoupon._id,
        formData: {
          code: selectedCoupon.code,
          description: selectedCoupon.description,
          type: selectedCoupon.type,
          discountAmount: Number(selectedCoupon.discountAmount),
          minimumOrderAmount: Number(selectedCoupon.minimumOrderAmount) || 0,
          maximumDiscount: Number(selectedCoupon.maximumDiscount) || 0,
          usageLimit: Number(selectedCoupon.usageLimit) || 0,
          isActive: selectedCoupon.isActive,
          activeDate: selectedCoupon.activeDate,
          expireDate: selectedCoupon.expireDate,
        },
      }).unwrap();

      refetch()
      toast.success("Coupon updated successfully!");
      setIsEditModalOpen(false);
      setSelectedCoupon(null);
    } catch (error: any) {
      console.error("Error updating coupon:", error);
      toast.error(error?.data?.message || "Failed to update coupon!");
    }
  };

  const getStatus = (coupon: Coupon) => {
    if (coupon.expireDate && new Date(coupon.expireDate) < new Date()) {
      return "expired";
    }
    return coupon.isActive ? "active" : "inactive";
  };

  const getShopName = (shopId: string) => {
    const shop = thisVendorShops.find((s: any) => s._id === shopId);
    return shop?.basicInfo?.name || "Unknown Shop";
  };

  if (isLoading || vendorLoading || shopsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading coupons...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading coupons. Please try again.</p>
      </div>
    );
  }

  if (thisVendorShops.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p className="text-gray-500">You don't have any shops yet!</p>
        <Link href="/vendor/create-shop">
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Create Your First Shop
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Add Coupon Button */}
      <div className="flex w-full justify-end">
        <Link href="/vendor/coupons/add-new-coupons">
          <button className="p-2 text-white rounded-lg bg-black flex items-center mt-2 mb-5 gap-2 hover:bg-gray-800 transition-colors">
            <IoAdd />
            Add New Shop Coupon
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white mt-8 p-5 border-2 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">My Shop Coupons</h1>
          <span className="text-sm text-gray-500">
            {coupons.length} {coupons.length === 1 ? "coupon" : "coupons"}
          </span>
        </div>
        <p className="text-gray-400 mb-6 text-sm">
          Manage promotional codes for your shops.
        </p>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    <div className="flex flex-col items-center gap-3">
                      <p>No coupons found for your shops.</p>
                      <Link href="/vendor/coupons/add-new-coupons">
                        <button className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                          Create Your First Coupon
                        </button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                          {getShopName(coupon.shopId!)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{coupon.type}</TableCell>
                    <TableCell>
                      {coupon.type === "fixed"
                        ? `${coupon.discountAmount}৳`
                        : `${coupon.discountAmount}%`}
                    </TableCell>
                    <TableCell>{coupon.minimumOrderAmount || 0}৳</TableCell>
                    <TableCell>
                      <StatusBadge status={getStatus(coupon)} />
                    </TableCell>
                    <TableCell>
                      {coupon.expireDate
                        ? new Date(coupon.expireDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditClick(coupon)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit coupon"
                        >
                          <FaRegEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(coupon._id!)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete coupon"
                          disabled={isDeleting}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedCoupon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">Edit Coupon</h2>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedCoupon.scope === "global" 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {selectedCoupon.scope === "global" ? "Global" : "Shop-Specific"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Update coupon details for <span className="font-medium text-gray-700">{selectedCoupon.code}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedCoupon(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isUpdating}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedCoupon.code}
                      onChange={(e) =>
                        setSelectedCoupon({ ...selectedCoupon, code: e.target.value.toUpperCase() })
                      }
                      className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                      placeholder="e.g., SAVE2024"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="flex items-center h-full">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCoupon.isActive}
                          onChange={(e) =>
                            setSelectedCoupon({
                              ...selectedCoupon,
                              isActive: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {selectedCoupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={selectedCoupon.description || ""}
                      onChange={(e) =>
                        setSelectedCoupon({ ...selectedCoupon, description: e.target.value })
                      }
                      className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of the coupon offer"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Discount Configuration Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Discount Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCoupon.type}
                      onChange={(e) =>
                        setSelectedCoupon({
                          ...selectedCoupon,
                          type: e.target.value as "fixed" | "percentage",
                        })
                      }
                      className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="fixed">Fixed Amount (৳)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Amount <span className="text-red-500">*</span>
                      {selectedCoupon.type === "percentage" && (
                        <span className="text-xs text-gray-500 ml-1">(Max 100%)</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={selectedCoupon.discountAmount}
                        onChange={(e) =>
                          setSelectedCoupon({
                            ...selectedCoupon,
                            discountAmount: Number(e.target.value),
                          })
                        }
                        min="0"
                        max={selectedCoupon.type === "percentage" ? "100" : undefined}
                        step={selectedCoupon.type === "percentage" ? "0.01" : "1"}
                        className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder={selectedCoupon.type === "fixed" ? "150" : "10"}
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {selectedCoupon.type === "fixed" ? "৳" : "%"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Order Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={selectedCoupon.minimumOrderAmount || 0}
                        onChange={(e) =>
                          setSelectedCoupon({
                            ...selectedCoupon,
                            minimumOrderAmount: Number(e.target.value),
                          })
                        }
                        min="0"
                        className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum cart value required</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Discount
                      {selectedCoupon.type === "fixed" && (
                        <span className="text-xs text-gray-500 ml-1">(Not applicable)</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={selectedCoupon.maximumDiscount || 0}
                        onChange={(e) =>
                          setSelectedCoupon({
                            ...selectedCoupon,
                            maximumDiscount: Number(e.target.value),
                          })
                        }
                        min="0"
                        className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="150"
                        disabled={selectedCoupon.type === "fixed"}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedCoupon.type === "percentage" 
                        ? "Cap for percentage discounts" 
                        : "Only for percentage type"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Usage & Validity Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Usage & Validity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={selectedCoupon.usageLimit || 0}
                      onChange={(e) =>
                        setSelectedCoupon({
                          ...selectedCoupon,
                          usageLimit: Number(e.target.value),
                        })
                      }
                      min="0"
                      className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Unlimited"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedCoupon.usedCount ? `Used: ${selectedCoupon.usedCount} times` : "Not used yet"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Active Date
                    </label>
                    <input
                      type="date"
                      value={
                        selectedCoupon.activeDate
                          ? selectedCoupon.activeDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setSelectedCoupon({
                          ...selectedCoupon,
                          activeDate: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">When coupon becomes active</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expire Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={
                        selectedCoupon.expireDate
                          ? selectedCoupon.expireDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setSelectedCoupon({
                          ...selectedCoupon,
                          expireDate: e.target.value,
                        })
                      }
                      min={selectedCoupon.activeDate?.split("T")[0] || new Date().toISOString().split("T")[0]}
                      className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">When coupon expires</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedCoupon(null);
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Coupon"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] md:w-[400px] text-center shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Delete Coupon?</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this coupon? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="border px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsManageVendor;
