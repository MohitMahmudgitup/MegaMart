"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BiMoneyWithdraw, BiUser, BiCreditCard, BiMobileAlt } from "react-icons/bi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useGetVendorByIdQuery, useGetVendorByUserIdQuery } from "@/redux/featured/vendor/vendorApi";
import { useCreateWithdrawalMutation } from "@/redux/featured/Withdrawals/WithdrawalsAPI";
import toast from "react-hot-toast";

interface SideWithdrawalsProps {
  showPopup?: boolean;
  setShowPopup?: React.Dispatch<React.SetStateAction<boolean>>;
  method?: string;
  setMethod?: React.Dispatch<React.SetStateAction<string>>;
  handleRefetch?: any
  withdrawalStats?: any
}

const Sidewithdrawals: React.FC<SideWithdrawalsProps> = ({ showPopup, setShowPopup, method, setMethod, handleRefetch, withdrawalStats }) => {
  const currentUser: any = useAppSelector(selectCurrentUser);
  const userId = currentUser?._id;

  const { data: vendor } = useGetVendorByUserIdQuery(userId!, {
    skip: !userId,
  });

  const vendorId = vendor?._id

  const [createWithdrawal] = useCreateWithdrawalMutation();

  // Form states
  const [amount, setAmount] = useState("");
  const [number, setNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");

 // Ensure vendorId is set when loaded
  useEffect(() => {
    if (vendorId) {
      setNumber(""); 
      setCardNumber("");
      setCardName("");
      setAmount("");
      setMethod?.("");
    }
  }, [vendorId]);

  const handleSubmit = async () => {
    if (!vendorId) return toast.error("Vendor data not loaded yet.");
    if (!method) return toast.error("Please select a withdrawal method.");
    if (!amount) return toast.error("Please enter an amount.");
    if (Number(amount) <= 0) return toast.error("Please enter a valid amount.");
    if (method !== "visa" && !number) return toast.error("Please enter a number.");
    if (method === "visa" && (!cardNumber || !cardName))
      return toast.error("Please enter card details.");

    
    const submitToast = toast.loading("Sending withdrawal request...");
    if (Number(amount) > withdrawalStats.currentBalance) {
      return toast.error(
        `You don't have enough balance. Your current balance is ৳${withdrawalStats.currentBalance}.`, { id: submitToast }
      );
    }
    const data: Record<string, any> = {
      vendorId: vendorId.toString(),
      amount: Number(amount),
      paymentMethod: method,
    };

    if (method === "visa") {
      data.visa = {
        cardNumber: Number(cardNumber),
        cardName,
      };
    } else {
      data.number = number.toString();
    }

    try {
      const response = await createWithdrawal(data).unwrap();

      toast.success("Withdrawal request sent successfully!", { id: submitToast });
      
      handleRefetch();
      setAmount("");
      setNumber("");
      setCardNumber("");
      setCardName("");
      setMethod?.("");
      setShowPopup?.(false);

    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err?.data?.errorSources?.[0]?.message ||
        err?.data?.message ||
        err?.message ||
        "Failed to send withdrawal request.";

      toast.error(errorMessage, { id: submitToast });
    }
  };




  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 transform ${
        showPopup ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-500 ease-in-out z-50`}
    >
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BiMoneyWithdraw className="text-xl" />
          Withdraw Funds
        </h2>
        <button onClick={() => setShowPopup?.(false)} className="text-white hover:text-red-200 text-xl transition">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-gray-600 mb-3 text-sm">
          Choose a withdrawal method and fill in your details.
        </p>

        {/* Select Method */}
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Method</label>
        <select
          value={method}
          onChange={(e) => setMethod?.(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">-- Choose Method --</option>
          <option value="bikash">Bikash</option>
          <option value="visa">VISA Card</option>
          <option value="bank">Bank</option>
        </select>

        {/* Dynamic Form */}
        <div
          className={`bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm transition-all duration-300 ${
            method ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {method === "bikash" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                <div className="relative">
                  <BiMobileAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. 01XXXXXXXXX"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full pl-10 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Withdraw Amount ($) *</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          )}

          {method === "visa" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Name on Card</label>
                <div className="relative">
                  <BiUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full pl-10 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Card Number</label>
                <div className="relative">
                  <BiCreditCard className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-10 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Withdraw Amount ($) *</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          )}

          {method === "bank" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Account Number *</label>
                <div className="relative">
                  <BiCreditCard className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter account number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full pl-10 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Withdraw Amount ($) *</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Button */}
        {method && (
          <Button
            onClick={handleSubmit}
            disabled={!vendorId}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded-lg shadow hover:from-indigo-600 hover:to-blue-600 transition-all duration-300"
          >
            Send Request
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidewithdrawals;
