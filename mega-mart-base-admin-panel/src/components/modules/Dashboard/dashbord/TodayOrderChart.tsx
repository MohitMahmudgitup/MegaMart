'use client';

import { MoreVertical } from "lucide-react";
import { LineChart, Line, XAxis, ResponsiveContainer } from "recharts";

export interface TodayOrderChartData {
  time: string;
  value: number;
}

interface TodayOrderChartProps {
  totalOrders: number;                // e.g., 457
  percentageChange: number;           // e.g., 6
  isIncrease?: boolean;               // true if ↑, false if ↓ (default true)
  chartData: TodayOrderChartData[];   // the array of orders over time
}

export default function TodayOrderChart({
  totalOrders,
  percentageChange,
  isIncrease = true,
  chartData = [],
}: TodayOrderChartProps) {
  return (
    <div className="bg-white dark:bg-card rounded-xl shadow-md p-4 w-full max-w-full">
      {/* Top row: title & menu icon */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-base font-medium">Today Order</h1>
        <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
      </div>

      {/* Row: total count & percentage change */}
      <div className="flex justify-between items-center w-full mb-1">
        <h2 className="text-2xl font-bold">{totalOrders}</h2>
        <p
          className={`text-xs ${
            isIncrease ? "text-green-600" : "text-red-600"
          }`}
        >
          {isIncrease ? "↑" : "↓"} {percentageChange}%{" "}
          <span className="text-muted-foreground">vs last day</span>
        </p>
      </div>

      {/* Subtitle */}
      <p className="text-xs text-muted-foreground mb-3">Orders Over Time</p>

      {/* Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
