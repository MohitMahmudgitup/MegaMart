"use client";

import React, { useState } from "react";
import Sidewithdrawals from "@/components/shared/withdrawals/Sidewithdrawals";
import { useGetWithdrawalsQuery } from "@/redux/featured/Withdrawals/WithdrawalsAPI";
import { AdminWithdrawalsManagementTable } from "@/components/WithdrawalsManagementTable/AdminWithdrawalsManagementTable";
import PaginationControls from "@/components/categorise/PaginationControls";
import WithdrawalsSkeleton from "../loadings/WithdrawalsSkeleton";

const Withdrawals = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [method, setMethod] = useState(""); // store selected method
  const { data: allWithdrawals, refetch ,isLoading } = useGetWithdrawalsQuery();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const tableData: any =
    allWithdrawals?.map((item: any) => {
      const fullNumber =
        item.visa?.cardNumber?.toString() ||
        item.number ||
        item.payment ||
        "N/A";

      return {
        _id: item._id,
        amount: `$${item.amount.toLocaleString()}`,
        name: item.paymentMethod,
        paymentMethod: item.paymentMethod,
        number: `${fullNumber}`,
        createdAt: new Date(item.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: item.status,
        cardName: item.visa?.cardName || "N/A",
      };
    }) || [];

  // Slice data for pagination
  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  if (isLoading) return <WithdrawalsSkeleton/>
  return (
    <div className="relative py-6 p-2 sm:p-4">
      <AdminWithdrawalsManagementTable data={paginatedData} refetch={refetch} />

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalItems={tableData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Withdrawals;
