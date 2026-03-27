import React from "react";
import { FaMoneyBillWave, FaPaypal, FaCreditCard } from "react-icons/fa";

type WithdrawalsCategoryItem = {
  label: string;
  rate: string | number;
  color?: string;
  icon?: React.ReactNode;
};

type WithdrawalsCategoriesProps = {
  items: WithdrawalsCategoryItem[];
};

const WithdrawalsCategories = ({ items }: WithdrawalsCategoriesProps) => {
  // Find the max rate for progress bar calculation
  const maxRate = Math.max(...items.map((item) => Number(item.rate)));

  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "paypal":
        return <FaPaypal className="text-blue-500 text-2xl mx-auto" />;
      case "card":
        return <FaCreditCard className="text-purple-500 text-2xl mx-auto" />;
      default:
        return <FaMoneyBillWave className="text-green-500 text-2xl mx-auto" />;
    }
  };

  return (
    <div className="mt-6 p-6 bg-gray-50 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-1">Payment Methods</h3>
      <p className="text-sm text-gray-500 mb-6">
        Overview of available withdrawal methods
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition duration-300"
          >
            {cat.icon || getIcon(cat.label)}
            <h4 className={`text-xl font-bold mt-3 ${cat.color || "text-black"}`}>
              {cat.rate}৳
            </h4>
            <p className="text-gray-500 mt-1 capitalize">{cat.label}</p>
            <div className="mt-3 h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${cat.color || "bg-green-500"}`}
                style={{ width: `${(Number(cat.rate) / maxRate) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WithdrawalsCategories;
