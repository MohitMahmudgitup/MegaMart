/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryCards } from "@/components/categorise/CategoryCards";
import { FilterBar } from "@/components/categorise/FilterTabs";
import HeaderActions from "@/components/categorise/HeaderActions";
import ProductTable from "@/components/categorise/ProductTable";
import PaginationControls from "@/components/categorise/PaginationControls";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "@/redux/featured/products/productsApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Swal from "sweetalert2";
import {
  selectProducts,
  setProducts,
} from "@/redux/featured/products/productSlice";
import { useGetAllCategoriesQuery } from "@/redux/featured/categories/categoryApi";
import {
  selectCategories,
  setCategories,
} from "@/redux/featured/categories/categorySlice";
import { ICategory } from "@/types/Category";
import { useRouter } from "next/navigation";
import { useGetAllShopsQuery } from "@/redux/featured/shop/shopApi";
import { setTags } from "@/redux/featured/tags/tagsSlice";
import { setBrands } from "@/redux/featured/brands/brandsSlice";
import { setShops } from "@/redux/featured/shop/shopSlice";
import { useGetAllTagsQuery } from "@/redux/featured/tags/tagsApi";
import { useGetAllBrandsQuery } from "@/redux/featured/brands/brandsApi";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useGetVendorByUserIdQuery } from "@/redux/featured/vendor/vendorApi";
import { IProduct } from "@/types/Product";
import AllProductsSkeleton from "../loadings/AllProductsSkeleton";

const My_All_Products = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentUser: any = useAppSelector(selectCurrentUser);
  const userId = currentUser?._id;

  const { data: vendor, isLoading: vendorLoading } = useGetVendorByUserIdQuery(userId!, {
    skip: !userId,
  });

  const {
    data: allProducts,
    isLoading: ProductsLoading,
    refetch,
  } = useGetAllProductsQuery({ vendorId: vendor?._id });



  const { data: allCategories, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);

  const thisVendorProducts = products?.filter(
    (product: IProduct) => product?.vendorId === vendor?._id
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Product");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    if (allCategories) {
      dispatch(setCategories(allCategories as ICategory[]));
    }
  }, [allCategories, dispatch]);

  useEffect(() => {
    if (allProducts) {
      dispatch(setProducts(allProducts as IProduct[]));
    }
  }, [allProducts, dispatch]);

  const filterTabs = useMemo(
    () => [
      {
        name: "All Product",
        count: products?.length || 0,
        active: activeFilter === "All Product",
      },
      {
        name: "Featured Products",
        count: products.filter((p) =>
          p.brandAndCategories?.tags?.some((tag: any) => tag.name === "Featured")
        ).length,
        active: activeFilter === "Featured Products",
      },
      {
        name: "On Sale",
        count: products.filter((p) =>
          p.brandAndCategories?.tags?.some((tag: any) => tag.name === "onSale")
        ).length,
        active: activeFilter === "On Sale",
      },
      {
        name: "Out of Stock",
        count: products.filter((p) => p.productInfo.quantity === 0).length,
        active: activeFilter === "Out of Stock",
      },
    ],
    [activeFilter, products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product: IProduct) => {
      if (
        activeFilter === "Featured Products" &&
        !product?.brandAndCategories?.tags?.some(
          (tag) => tag.name === "Featured"
        )
      )
        return false;
      if (
        activeFilter === "On Sale" &&
        !product?.brandAndCategories?.tags?.some((tag) => tag.name === "onSale")
      )
        return false;
      if (activeFilter === "Out of Stock" && product.productInfo.quantity !== 0)
        return false;

      if (
        searchQuery.trim() &&
        !product.description.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [products, activeFilter, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredProducts.length, currentPage]);

  const handleProductAction = (action: string, id: string) => {
    if (action === "delete") {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          try {
            const res = await deleteProduct(id).unwrap();

            Swal.fire({
              title: "Deleted!",
              text: `${res.message}`,
              icon: "success",
            });
            refetch();
          } catch (error) {
            Swal.fire({
              title: "Error!",
              text: "Something went wrong while deleting.",
              icon: "error",
            });
          }
        }
      });
    }

    if (action === "edit") {
      router.push(`/vendor/edit-product/${id}`);
    }
  };

  const { data: tagsData } = useGetAllTagsQuery(undefined);
  const { data: brandsData } = useGetAllBrandsQuery(undefined);
  const { data: shopData } = useGetAllShopsQuery();

  useEffect(() => {
    if (tagsData) {
      dispatch(setTags(tagsData));
    }
    if (brandsData) {
      dispatch(setBrands(brandsData));
    }
    if (shopData) {
      dispatch(setShops(shopData));
    }
  }, [dispatch, tagsData, brandsData, shopData]);

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">User not found. Please login again.</p>
      </div>
    );
  }


  if (!vendor) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Vendor information not found!</p>
      </div>
    );
  }
  if (ProductsLoading && vendorLoading) return <AllProductsSkeleton />
  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">My Products</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your product inventory
            </p>
          </div>
        </div>

        <HeaderActions products={paginatedProducts} />

        {categoriesLoading ? (
          <div className="flex justify-center py-8">
            <span className="text-gray-500">Loading categories...</span>
          </div>
        ) : (
          <CategoryCards categories={categories} />
        )}

        {/* Filter + Search Bar */}
        <FilterBar
          tabs={filterTabs}
          activeFilter={activeFilter}
          setActiveFilter={(filter) => {
            setActiveFilter(filter);
            setCurrentPage(1);
          }}
          searchQuery={searchQuery}
          setSearchQuery={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
        />

        {/* Product Table */}
        <Card>
          <CardContent className="p-0">
            {ProductsLoading ? (
              <div className="flex justify-center py-12">
                <span className="text-gray-500">Loading products...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">
                  {searchQuery || activeFilter !== "All Product"
                    ? "No products found matching your filters"
                    : "You haven't added any products yet"}
                </p>
                {!searchQuery && activeFilter === "All Product" && (
                  <button
                    onClick={() => router.push("/vendor/add-product")}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    Add Your First Product
                  </button>
                )}
              </div>
            ) : (
              <ProductTable
                products={paginatedProducts}
                onAction={handleProductAction}
              />
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default My_All_Products;
