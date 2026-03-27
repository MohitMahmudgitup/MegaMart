"use client";
import Swal from 'sweetalert2'
import React, { useState } from "react";
import WithdrawalsCategories from "@/components/modules/Dashboard/Withdrawals/WithdrawalsCategories";
import { Button } from "@/components/ui/button";
import { BiMoneyWithdraw } from "react-icons/bi";
import Sidewithdrawals from "@/components/shared/withdrawals/Sidewithdrawals";
import { useDeleteWithdrawalMutation, useGetWithdrawalByIdQuery, useGetWithdrawalsQuery } from "@/redux/featured/Withdrawals/WithdrawalsAPI";
import { VendorWithdrawalsManagementTable } from "@/components/WithdrawalsManagementTable/VendorWithdrawalsManagementTable";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useGetVendorByIdQuery, useGetVendorByUserIdQuery } from "@/redux/featured/vendor/vendorApi";
import { useGetVendorStatsQuery } from "@/redux/featured/vendorDashboards/vendorDashboardsAPI";

const Withdrawals = () => {
  const [showPopup, setShowPopup] = useState(false);
  const currentUser: any = useAppSelector(selectCurrentUser);
   const userId = currentUser?._id;
   
   const { data: vendor, isLoading: vendorLoading } = useGetVendorByUserIdQuery(userId!, {
     skip: !userId,
   });
  const { data: vendorStatsQuery, refetch: statsRefetch } = useGetVendorStatsQuery(vendor?._id);
  const withdrawalStats: any = vendorStatsQuery?.WithdrawalStats || {};
  const [method, setMethod] = useState("");
  const { data: singleWithdrawals, refetch } = useGetWithdrawalByIdQuery(vendor?._id)
  const [deleteWithdrawal] = useDeleteWithdrawalMutation();
  console.log(singleWithdrawals);

  const handleRefetch = () => {
    refetch();
    statsRefetch();
  }

  const handleDelete = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteWithdrawal({ id, body: { isDeleted: true } }).unwrap();
          handleRefetch()
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    } catch (err) {
      console.error("Error deleting withdrawal:", err);
    }
  };



  const withdrawalItems = [
    { label: "Current Balance", rate: withdrawalStats?.currentBalance },
    { label: "Requested Balance", rate: withdrawalStats?.requestedBalance },
    { label: "Withdrawn Balance", rate: withdrawalStats?.withdrawnBalance },
    { label: "Revenue", rate: withdrawalStats?.revenue },
  ];

  const tableData: any =
    singleWithdrawals?.map((item: any) => {

      const fullNumber = item.visa?.cardNumber?.toString() || item.number || item.payment || "N/A";
      const displayNumber = fullNumber !== "N/A" ? fullNumber.slice(-4) : fullNumber;

      return {
        _id: item._id,
        amount: `$${item.amount.toLocaleString()}`,
        name: item.paymentMethod,
        paymentMethod: item.paymentMethod,
        number: `***${displayNumber}`,
        createdAt: new Date(item.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: item.status,
      };
    }) || [];



  return (
    <div className="relative py-6 p-2 sm:p-4">
      {/* Withdraw button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setShowPopup(true)} >
          <BiMoneyWithdraw className="text-lg" />
          Withdraw
        </Button>
      </div>

      {/* Main content */}
      <WithdrawalsCategories items={withdrawalItems || []} />

      <VendorWithdrawalsManagementTable data={tableData} onDelete={handleDelete} />

      {/* Right-side popup (drawer) */}
      <Sidewithdrawals
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        method={method}
        setMethod={setMethod}
        handleRefetch={handleRefetch}
        withdrawalStats={withdrawalStats}
      />

      {/* Background overlay */}
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500"
        ></div>
      )}
    </div>
  );
};

export default Withdrawals;

