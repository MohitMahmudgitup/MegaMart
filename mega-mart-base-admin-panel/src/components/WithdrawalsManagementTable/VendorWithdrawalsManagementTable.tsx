"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaEye, FaTrash } from "react-icons/fa";
import { Withdrawal } from "@/types/Withdrawals";
import {WithdrawalsView} from "../shared/withdrawals/WithdrawalsViewVendor";

interface Props {
  data: Withdrawal[];
  onDelete?: (id: string) => void;
}

export const VendorWithdrawalsManagementTable: React.FC<Props> = ({
  data,
  onDelete,
}) => {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);

  const statusClasses: Record<string, string> = {
    approved: "bg-green-100 text-green-700 border border-green-300",
    rejected: "bg-red-100 text-red-700 border border-red-300",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    default: "bg-gray-100 text-gray-700 border border-gray-300",
  };

  return (
    <>
      <div className="overflow-x-auto my-6 bg-white shadow rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Amount", "Method", "Account", "Date", "Status", "Actions"].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, idx) => (
              <tr
                key={item._id}
                className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}
              >
                <td className="px-6 py-4 whitespace-nowrap font-semibold">
                  {item.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item?.paymentMethod}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.visa?.cardNumber || item.number || item.payment || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusClasses[item.status.toLowerCase()] || statusClasses.default
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-1 hover:bg-red-600"
                      onClick={() => onDelete?.(item._id)}
                    >
                      <FaTrash className="text-white" /> Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex items-center gap-1 hover:bg-gray-200"
                      onClick={() => setSelectedWithdrawal(item)}
                    >
                      <FaEye /> View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
{selectedWithdrawal && (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
    <div className=" p-6 w-[] shadow-lg relative">
      {/* Close button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-lg"
        onClick={() => setSelectedWithdrawal(null)}
      >
        &times;
      </button>

      {/* Withdrawal Details */}
      <WithdrawalsView withdrawal={selectedWithdrawal}  setSelectedWithdrawal={setSelectedWithdrawal} />
    </div>
  </div>
)}

    </>
  );
};
