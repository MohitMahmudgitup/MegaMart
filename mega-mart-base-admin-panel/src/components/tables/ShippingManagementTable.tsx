"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import SearchInput from "../shared/SearchInput";
import Swal from "sweetalert2";

import {
  IShipping,
  useDeleteShippingMutation,
  useGetAllShippingsQuery,
} from "@/redux/featured/shipping/shippingApi";
import CreateAndUpdateShipping from "../shippings/CreateAndUpdateshipping";
import { ITagQueryParams } from "@/types/tags";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import AttributeManagementSkeleton from "../pages/loadings/AttributeManagementSkeleton";

export type ShippingItem = {
  name: string;
  carrier: string;
  cost: string;
  duration: string;
  region: string;
  orders: number;
  status: "Active" | "Inactive";
};

const ShippingManagementTable = () => {
  const [queryParams, setQueryParams] = useState<ITagQueryParams>({ limit: 8 });
  const {
    data: allShippings,
    isLoading,
    refetch,
  } = useGetAllShippingsQuery(queryParams);
  const [deleteShippingData] = useDeleteShippingMutation();

  const deleteShipping = async (id: string) => {
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
          await deleteShippingData(id).unwrap();
          refetch();

          Swal.fire({
            title: "Deleted!",
            text: "Shipping deleted successfully!",
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
  };

  const types = ["free", "fixed", "percentage"];

 
  return (
    <section className="mt-8 space-y-4 bg-white p-4 rounded-md">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Shipping Carriers</h3>
        <p className="text-sm text-muted-foreground">
          Overview of integrated shipping partners
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center my-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tags"
            value={queryParams.searchTerm}
            onChange={(e) =>
              setQueryParams((prev) => ({
                ...prev,
                searchTerm: e.target.value,
              }))
            }
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 text-gray-500">
          <div className="flex gap-2">
            <Select
              value={queryParams.type || ""}
              onValueChange={(value) =>
                setQueryParams((prev) => ({
                  ...prev,
                  type: value === "all" ? undefined : value,
                }))
              }
            >
              <SelectTrigger className="w-40 text-black">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" disabled size="sm">
              Sort by Usage
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  shipping Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Global
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(allShippings?.length as number) > 0 ? (
                allShippings?.map((shipping: IShipping, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{shipping.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{shipping.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{shipping.amount}</span>
                      </div>
                    </td>{" "}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{shipping.global}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <CreateAndUpdateShipping
                          updateShipping={shipping}
                          type="edit"
                          refetch={refetch}
                        >
                          Edit
                        </CreateAndUpdateShipping>
                        <Button
                          onClick={() => deleteShipping(shipping._id)}
                          className="bg-rose-500"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No shippings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ShippingManagementTable;
