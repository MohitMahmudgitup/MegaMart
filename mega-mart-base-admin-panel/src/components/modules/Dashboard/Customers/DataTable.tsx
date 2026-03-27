'use client';

import { useGetAllCustomersQuery } from "@/redux/featured/customer/customerApi";

export function DataTable() {
  const { data: allcustomer, isLoading, isError } = useGetAllCustomersQuery();

  if (isLoading) {
    return <div>Loading customers...</div>;
  }

  if (isError) {
    return <div>Failed to load customers.</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 w-full max-w-full overflow-auto">
      <table className="min-w-[700px] w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left p-3">NAME</th>
            <th className="text-left p-3">PHONE NUMBER</th>
            <th className="text-left p-3">CREATED</th>
            <th className="text-left p-3">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {allcustomer?.map((customer: any) => (
            <tr key={customer._id} className="border-t">
              <td className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-400" />
                <div>
                  <div className="font-medium">{customer.userId?.name}</div>
                  <div className="text-gray-500 text-xs">{customer.userId?.email}</div>
                </div>
              </td>
              <td className="p-3">{customer.userId?.contactNo || "N/A"}</td>
              <td className="p-3">{new Date(customer.createdAt).toLocaleDateString()}</td>
              <td className="p-3 flex gap-3">
                <button className="text-blue-500 hover:underline text-xs">Edit</button>
                <button className="text-red-500 hover:underline text-xs">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
