'use client';

import { MoreVertical } from 'lucide-react';

export type OrderStatus = 'Pending' | 'Completed';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email?: string;
}

export interface Order {
  _id: string;
  customerInfo: CustomerInfo;
  status: OrderStatus;
  
  totalAmount: number;
}

interface RecentOrdersTableProps {
  title?: string;
  RecentOrders: Order[];
}

const statusColor: Record<OrderStatus, string> = {
  Pending: 'text-yellow-500',
  Completed: 'text-green-600',
};

export const transformRecentOrders = (rawOrders: any[]): Order[] =>
  rawOrders.map((item) => ({
    _id: item._id,
    customerInfo: item.customerInfo,
    status:
      item.orderInfo?.[0]?.status?.charAt(0).toUpperCase() +
        item.orderInfo?.[0]?.status?.slice(1) || 'Pending',
    totalAmount:
      item.orderInfo?.[0]?.totalAmount?.total || item.totalAmount || 0,
  }));

export function RecentOrdersTable({
  title = 'Recent Orders',
  RecentOrders,
}: RecentOrdersTableProps) {
  return (
    <div className="bg-white dark:bg-card rounded-xl shadow-md p-4 w-full max-w-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <div
         
          className="flex items-center gap-2 text-sm text-blue-500 cursor-pointer"
        >
          View All
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-muted border-b text-muted-foreground">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {( RecentOrders ?? []).map((order, idx) => (
              <tr className="border-none" key={idx}>
                <td className="p-2">{order._id.slice(0, 4).split('').reverse().join('')}</td>
                <td className="p-2">
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                </td>
                <td className={`p-2 font-medium ${statusColor[order.status]}`}>
                  {order.status}
                </td>
                <td className="p-2 text-right">
                  ৳ {order.totalAmount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
