/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Filter, ArrowUpDown, Star } from "lucide-react";
import Image from "next/image";
import { useDeleteBrandMutation, useGetAllBrandsQuery } from "@/redux/featured/brands/brandsApi";
import CreateBrand from "@/components/pages/admin/CreateBrand";
import BrandEditor from "@/components/Brand-Editor";
import PaginationControls from "@/components/categorise/PaginationControls";
import BrandManagementSkeleton from "../loadings/BrandManagementSkeleton";
import toast from "react-hot-toast";

const BrandManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [editBrand, setEditBrand] = useState<any>(null);
  const [addPopup, setAddPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteBrand] = useDeleteBrandMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const ITEMS_PER_PAGE = 6; 

  const { data: brands, isLoading , refetch } = useGetAllBrandsQuery();

  const stats = [
    { title: "Total Brands", value: "24", subtitle: "+2 this month", icon: "📊", color: "text-purple-600" },
    { title: "Active Brands", value: "21", subtitle: "87.5% of total", icon: "✅", color: "text-green-600" },
    { title: "Top Brand Products", value: "234", subtitle: "Best selling", icon: "🏆", color: "text-pink-600" },
    { title: "Avg Rating", value: "4.6", subtitle: "Out of 5", icon: "⭐", color: "text-yellow-600" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter brands by search term
  const filteredBrands = useMemo(() => {
    return (
      brands?.filter(
        (brand) =>
          brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brand.icon?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    );
  }, [brands, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredBrands.length / ITEMS_PER_PAGE);
  const paginatedBrands = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBrands.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredBrands, currentPage]);

  if (isLoading) return <BrandManagementSkeleton />

  return (
    <div className="space-y-6 py-6">
      {/* Add Brand Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setAddPopup(true)}
          className="bg-gray-800 hover:bg-gray-900 text-white"
        >
          + Add Brand
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
                <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Brand Management Section */}
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Brand Management</h2>
          <p className="text-gray-600 text-sm">Manage your product brands and suppliers</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>

        {/* Brand Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedBrands.map((brand: any, index: any) => (
            <Card key={index} className="p-4">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-semibold">
                      {brand.icon?.url ? (
                        <Image
                          src={brand.icon.url}
                          alt={brand.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        brand.name?.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{brand.name}</h3>
                      <p className="text-sm text-gray-600">{brand.icon?.name || "Brand"}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor("Active")}>---</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Products</span>
                    <span className="font-medium">---</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">---</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    variant="destructive"
                    onClick={() => {
                      setSelectedBrandId(brand._id); // store which brand to delete
                      setShowConfirm(true);           // open Yes/No popup
                    }}
                  >
                    Delete
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditBrand(brand)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedBrand(brand)}
                  >
                    View Brand
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PaginationControls */}
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalItems={filteredBrands.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
  {showConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-lg p-6 w-[360px]">
      <h2 className="text-lg font-semibold mb-2">
        Are you sure you want to delete this brand?
      </h2>

      <div className="flex gap-3 mt-4">
        {/* NO */}
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowConfirm(false)}
        >
          No
        </Button>

        {/* YES */}
        <Button
          variant="destructive"
          className="flex-1"
          onClick={async () => {
            await deleteBrand(selectedBrandId);  // delete brand
            setShowConfirm(false);
            setSelectedBrandId("");
            toast.success("Brand deleted successfully");
            refetch();       
          }}
        >
          Yes
        </Button>
      </div>
    </div>
  </div>
)}



      {/* Popup for Brand View */}
      <Dialog open={!!selectedBrand} onOpenChange={() => setSelectedBrand(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedBrand?.name}</DialogTitle>
          </DialogHeader>
          {selectedBrand && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {selectedBrand.icon?.url ? (
                    <Image
                      src={selectedBrand.icon.url}
                      alt={selectedBrand.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    selectedBrand.name?.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Brand ID: {selectedBrand._id}</p>
                  <p className="text-sm text-gray-500">Icon Name: {selectedBrand.icon?.name || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Products: ---</p>
                <p className="text-sm font-medium">Rating: ---</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Popup for Edit Brand */}
      <Dialog open={!!editBrand} onOpenChange={() => setEditBrand(null)}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          {editBrand && <BrandEditor brandId={editBrand._id} />}
        </DialogContent>
      </Dialog>

      {/* Popup: Add Brand */}
      <Dialog open={addPopup} onOpenChange={() => setAddPopup(false)}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <CreateBrand />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandManagement;
