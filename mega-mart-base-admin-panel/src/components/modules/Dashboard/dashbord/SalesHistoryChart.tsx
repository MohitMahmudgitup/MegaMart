'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface MonthlySale {
  totalSales: number
  orderCount: number
  monthName: string
  year: number
}

interface MonthlySalesHistory {
  vendorId: string
  monthlySales: MonthlySale[]
}

interface SalesHistoryChartProps {
  title?: string
  data?: MonthlySalesHistory | MonthlySale[]
}

export default function SalesHistoryChart({
  title = 'Sales History',
  data,
}: SalesHistoryChartProps) {
  // Handle both data structures: array or object with monthlySales property
  const salesData = Array.isArray(data) 
    ? data 
    : data?.monthlySales || []

  // Safely format the data with proper fallbacks
  const formattedData = salesData.map((item) => ({
    month: item.monthName?.slice(0, 3).toUpperCase() || 'N/A',
    sales: item.totalSales || 0,
    orderCount: item.orderCount || 0,
  }))

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-md p-6 w-full">
      <h2 className="text-base font-semibold text-black dark:text-white mb-4">
        {title}
      </h2>

      {formattedData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No sales data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              formatter={(value: number) => [
                `$${(value / 1000).toFixed(1)}k`,
                'Sales',
              ]}
            />
            <Bar
              dataKey="sales"
              radius={[8, 8, 0, 0]}
              fill="url(#gradient)"
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}