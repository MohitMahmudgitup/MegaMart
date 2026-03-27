"use client";

import React, { useState } from "react";
import WithdrawalsCategories from "@/components/modules/Dashboard/Withdrawals/WithdrawalsCategories";
import { Button } from "@/components/ui/button";
import { BiMoneyWithdraw } from "react-icons/bi";
import { useDeleteWithdrawalMutation, useGetWithdrawalByIdQuery } from "@/redux/featured/Withdrawals/WithdrawalsAPI";
import { VendorWithdrawalsManagementTable} from "@/components/WithdrawalsManagementTable/VendorWithdrawalsManagementTable";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useGetVendorByIdQuery } from "@/redux/featured/vendor/vendorApi";
import { useGetVendorStatsQuery } from "@/redux/featured/vendorDashboards/vendorDashboardsAPI";
import Sidewithdrawals from "@/components/shared/withdrawals/Sidewithdrawals";

const Withdrawals = () => {
  const [showPopup, setShowPopup] = useState(false);
const singlevendorId = "68ee66ec4f93c4f28988bd5d";
const { data : vendorStatsQuery } = useGetVendorStatsQuery(singlevendorId);
  const withdrawalStats : any = vendorStatsQuery?.WithdrawalStats || {};
  const [method, setMethod] = useState("");
  const currentUser : any = useAppSelector(selectCurrentUser);
  const userId = currentUser?._id;
  const { data : vendorApi } = useGetVendorByIdQuery(userId);
  const vendorId = vendorApi?.data?.[0]?._id;
  const { data: singleWithdrawals } = useGetWithdrawalByIdQuery(vendorId)
  const [deleteWithdrawal] = useDeleteWithdrawalMutation();

  const handleDelete = async (id: string) => {
  try {
    await deleteWithdrawal({ id, body: { isDeleted: true } }).unwrap();
  } catch (err) {
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
      <WithdrawalsCategories items= { withdrawalItems || []} />

      <VendorWithdrawalsManagementTable data={tableData}  onDelete={handleDelete} />

      {/* Right-side popup (drawer) */}
      <Sidewithdrawals
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        method={method}
        setMethod={setMethod}
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
