"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import { CheckCircle, XCircle, Copy, Home, RotateCcw } from "lucide-react";

const PaymentResultPage = () => {
  const searchParams = useSearchParams();

  const status = searchParams.get("status"); 
  const transactionId = searchParams.get("transactionId");
  const amount = searchParams.get("amount");
  const message = searchParams.get("message");

  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSuccess = status === "success";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isSuccess
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-red-50 via-white to-rose-50"
      }`}
    >
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Status Header */}
          <div
            className={`p-8 flex flex-col items-center ${
              isSuccess ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-red-500 to-rose-500"
            }`}
          >
            {isSuccess ? (
              <CheckCircle className="w-16 h-16 text-white mb-4 animate-bounce" />
            ) : (
              <XCircle className="w-16 h-16 text-white mb-4" />
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {isSuccess ? "Payment Successful" : "Payment Failed"}
            </h1>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            {/* Status Message */}
            <div className={`p-4 rounded-lg ${isSuccess ? "bg-green-50" : "bg-red-50"}`}>
              <p className={`text-sm font-medium ${isSuccess ? "text-green-800" : "text-red-800"}`}>
                {message || (isSuccess ? "Your payment has been processed successfully." : "Something went wrong during payment processing.")}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Amount</span>
                <span className="text-lg font-bold text-gray-900">
                  {amount ? `${amount} BDT` : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-900 text-right max-w-xs break-all">
                    {transactionId || "N/A"}
                  </span>
                  {transactionId && (
                    <button
                      onClick={copyToClipboard}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copy transaction ID"
                    >
                      <Copy className={`w-4 h-4 ${copied ? "text-green-600" : "text-gray-400"}`} />
                    </button>
                  )}
                </div>
              </div>

              {copied && (
                <div className="text-sm text-green-600 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Copied to clipboard
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => window.location.href = "/admin/withdrawals"}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSuccess
                    ? "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                    : "bg-red-600 text-white hover:bg-red-700 active:scale-95"
                }`}
              >
                {/* <Home className="w-5 h-5" /> */}
                Back to withdrawals
              </button>
              
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              {isSuccess ? "Thank you for your payment" : "Please contact support if you need assistance"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;