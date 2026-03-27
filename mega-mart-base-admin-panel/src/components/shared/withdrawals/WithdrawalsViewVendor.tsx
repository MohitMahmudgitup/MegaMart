import React from "react";
import { Withdrawal } from "@/types/Withdrawals";
import { usePayVendorMutation } from "@/redux/featured/Payment/PaymentAPI";
import {
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ArrowRight,
  ChevronDownIcon,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/app/(dashboard)/(dashboardLayout)/admin/order/page";
import { useUpdateWithdrawMutation } from "@/redux/featured/Withdrawals/WithdrawalsAPI";
import toast from "react-hot-toast";

interface WithdrawalsViewProps {
  withdrawal: Withdrawal;
  refetch?: any
  setSelectedWithdrawal:any
}

export const WithdrawalsView: React.FC<WithdrawalsViewProps> = ({
  withdrawal,
  refetch,
  setSelectedWithdrawal
}) => {
  const [UpdateWithdraw, { isLoading }] = useUpdateWithdrawMutation();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await UpdateWithdraw({
        id: orderId,
        status: { status: newStatus },
      }).unwrap();
      refetch()
      setSelectedWithdrawal(null)
      toast.success('Status Updated!')
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { bg: string; text: string; icon: React.ReactNode; label: string }
    > = {
      approved: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        icon: <CheckCircle className="w-5 h-5" />,
        label: "Approved",
      },
      pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        icon: <Clock className="w-5 h-5" />,
        label: "Pending",
      },
      rejected: {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: <AlertCircle className="w-5 h-5" />,
        label: "Rejected",
      },
    };
    return (
      configs[status] || {
        bg: "bg-gray-50",
        text: "text-gray-700",
        icon: <AlertCircle className="w-5 h-5" />,
        label: status,
      }
    );
  };

  const statusConfig = getStatusConfig(withdrawal.status);
  const accountNumber =
    withdrawal.visa?.cardNumber ||
    withdrawal.number ||
    withdrawal.payment ||
    "N/A";
  
  

  const statuses = [
   'approved',
   'on-hold',
    'processing',
    'pending',
   'rejected',
    'FAILED',
  ];


  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card */}
      <div className="bg-white rounded-2xl  overflow-hidden  border-gray-200   ">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-1">
            Withdrawal Request
          </h2>
          <p className="text-blue-100 text-sm">
            Review and process your withdrawal
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Amount Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 rounded-full p-3">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-600 font-medium">Total Amount</span>
              </div>
              <span className="text-3xl font-bold text-blue-600">
                {withdrawal.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            {/* Payment Method */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 font-medium">Method</span>
              </div>
              <span className="font-semibold text-gray-900 capitalize">
                {withdrawal.paymentMethod}
              </span>
            </div>
            {withdrawal.paymentMethod === "visa" && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 font-medium">Card Name</span>
                </div>
                <span className="font-medium text-gray-900">
                  {withdrawal.cardName || "N/A"}
                </span>
              </div>
            )}

            {/* Account Number */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 font-medium">Account</span>
              </div>
              <span className="font-mono text-sm font-semibold text-gray-900">
                {accountNumber}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 font-medium">Request Date</span>
              </div>
              <span className="font-medium text-gray-900">
                {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <span className="text-gray-600 font-medium">Status</span>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${statusConfig.bg} ${statusConfig.text}`}
              >
                {statusConfig.icon}
                <span>{statusConfig.label}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200 min-w-[130px] text-center border-gray-300 hover:bg-gray-100"
                >
                  Update Status
                  <ChevronDownIcon className="-me-1 opacity-60 ml-1" size={16} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="min-w-[180px]">
                {statuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusChange(withdrawal._id, status)}
                  >
                    {status.replace(/-/g, " ")}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
         </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Your transaction is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};