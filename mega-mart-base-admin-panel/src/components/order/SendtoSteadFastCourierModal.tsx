"use client";
import { Order } from "@/types/Order";
import { useState, FormEvent, useEffect, ChangeEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  useUpdateStatsMutation,
  useUpdatetrackCodeMutation,
} from "@/redux/featured/order/orderApi";
import { Button } from "../ui/button";

export type OrderPayload = {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string;
  recipient_address: string;
  cod_amount: number;
  delivery_type: number;
};

type SendtoSteadFastCourierModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  setIsLoading: any;
  initialData?: Partial<Order> | null;
  refetch?: any;
};

const DEFAULT_FORM_STATE: OrderPayload = {
  invoice: "",
  recipient_name: "",
  recipient_phone: "",
  recipient_email: "",
  recipient_address: "",
  cod_amount: 0,
  delivery_type: 0,
};

const SendtoSteadFastCourierModal = ({
  isOpen,
  onClose,
  isLoading,
  setIsLoading,
  initialData,
  refetch,
}: SendtoSteadFastCourierModalProps) => {
  const [updateOrderStatus] = useUpdateStatsMutation();
  const [UpdatetrackCode] = useUpdatetrackCodeMutation();
  const [formData, setFormData] = useState<OrderPayload>(DEFAULT_FORM_STATE);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          invoice: initialData?.orderInfo![0]?.trackingNumber,
          recipient_name:
            `${initialData.customerInfo?.firstName || ''} ${initialData.customerInfo?.lastName || ''}`.trim() || "",
          recipient_phone: initialData.customerInfo?.phone || "",
          recipient_email: initialData.customerInfo?.email || "",
          recipient_address: initialData.customerInfo?.address || "",
          cod_amount: initialData?.paymentStatus === 'PAID' ? 0 : Number(initialData.payableAmount || initialData.totalAmount) || 0,
          delivery_type: 0,
        });
      } else {
        setFormData(DEFAULT_FORM_STATE);
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) || 0 : value,
    }));
  };



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://portal.packzy.com/api/v1/create_order`,
        {
          ...formData,
        },
        {
          headers: {
            "Api-Key": process.env.NEXT_PUBLIC_STEADFAST_API_KEY,
            "Secret-Key": process.env.NEXT_PUBLIC_STEADFAST_SECRET_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 200) {
        toast.success(response.data.message);

        await updateOrderStatus({
          id: initialData?._id as string,
          status: { status: "processing" },
        }).unwrap();

        await UpdatetrackCode({
          id: initialData?._id as string,
          trackCode: { trackCode: response?.data?.consignment?.tracking_code },
        });

        refetch();
        onClose();
      } else {
        if (response?.data?.errors) {
          const errors = response.data.errors;
          const errorMessages = Object.values(errors)
            .flat()
            .join(", ");
          toast.error(errorMessages || "Order creation failed!");
        } else if (response?.data?.message) {
          toast.error(response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors)
          .flat()
          .join(", ");
        toast.error(errorMessages || "Order creation failed!");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }

  };



  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000048] bg-opacity-60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-white shadow-lg transition-colors hover:bg-gray-800 disabled:bg-gray-300"
        >
          &times;
        </button>

        {/* Change title based on whether we are creating or editing */}
        <h2 className="mb-4 text-xl font-semibold">
          Send to SteadFast Courier
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          style={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          {/* Row 1: Invoice & Name */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="invoice"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Invoice ID
              </label>
              <input
                type="text"
                id="invoice"
                name="invoice"
                value={formData.invoice}
                onChange={handleChange}
                className="w-full rounded-md border p-2 shadow-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="recipient_name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Recipient Name
              </label>
              <input
                type="text"
                id="recipient_name"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                className="w-full rounded-md border p-2 shadow-sm"
                required
              />
            </div>
          </div>

          {/* Row 2: Phone & COD Amount */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="recipient_phone"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Recipient Phone
                </label>
               
             </div>
              <input
                type="tel"
                id="recipient_phone"
                name="recipient_phone"
                value={formData.recipient_phone}
                onChange={handleChange}
                className="w-full rounded-md border p-2 shadow-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="cod_amount"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                COD Amount {initialData?.paymentStatus === 'PAID' && '(Already Paid)'}
              </label>
              <input
                type="number"
                id="cod_amount"
                name="cod_amount"
                disabled={initialData?.paymentStatus === 'PAID'}
                value={initialData?.paymentStatus === 'PAID' ? 0 : formData.cod_amount}
                onChange={handleChange}
                className="w-full rounded-md border p-2 shadow-sm disabled:bg-gray-100"
                required
              />
              {initialData?.payableAmount && initialData.payableAmount !== initialData.totalAmount && (
                <p className="text-xs text-gray-600 mt-1">
                  Final amount after shipping & discount: ৳{initialData.payableAmount}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Address */}
          <div>
            <label
              htmlFor="recipient_address"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Recipient Address
            </label>
            <textarea
              id="recipient_address"
              name="recipient_address"
              rows={3}
              value={formData.recipient_address}
              onChange={handleChange}
              className="w-full rounded-md border p-2 shadow-sm"
              required
            />
          </div>

          {/* Row 5: Note & Delivery Type */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="delivery_type"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Delivery Type
              </label>
              <select
                id="delivery_type"
                name="delivery_type"
                value={formData.delivery_type}
                onChange={handleChange}
                className="w-full rounded-md border p-2 shadow-sm"
              >
                <option value={0}>Home</option>
                <option value={1}>Point Delivery/Steadfast Hub Pick Up</option>
                {/* <option value={1}>Express</option> */}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendtoSteadFastCourierModal;
