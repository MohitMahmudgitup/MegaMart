'use client';

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from 'lucide-react';

type Props = {
  userStats?: {
    totalUsers: number;
    percentChange: number | null;
    trend: 'up' | 'down' | 'neutral';
    comparedTo: string;
  };
};

export default function SessionCard({ userStats }: Props) {
  // ✅ Provide safe defaults so destructuring never breaks
  const {
    totalUsers = 0,
    percentChange = 0,
    trend = 'neutral',
    comparedTo = 'Loading...',
  } = userStats || {};

  // ✅ If no data yet, show loading placeholder
  if (!userStats) {
    return (
      <div className="relative bg-[#C9C9C926] text-card-foreground rounded-xl p-4 shadow-sm w-full h-[200px] flex flex-col justify-center items-center text-muted-foreground">
        <div className="animate-pulse text-sm">Loading user stats...</div>
      </div>
    );
  }

  // Determine icon and color based on trend
  const trendIcon =
    trend === 'up' ? (
      <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
    ) : trend === 'down' ? (
      <ArrowDownRight className="w-4 h-4 mr-1 text-destructive" />
    ) : (
      <Minus className="w-4 h-4 mr-1 text-muted-foreground" />
    );

  // Dummy chart data
  const chartData = [
    { value: totalUsers - 5 },
    { value: totalUsers - 3 },
    { value: totalUsers - 1 },
    { value: totalUsers },
  ];

  return (
    <div className="relative bg-[#C9C9C926] text-card-foreground rounded-xl p-4 shadow-sm w-full h-[200px] lg:max-w-full md:w-full aspect-[454/199] md:h-[199px] flex flex-col justify-between overflow-hidden">
      {/* Top Section */}
      <div>
        <h3 className="text-xl font-semibold">User Stats</h3>
        <p className="text-sm font-medium text-muted-foreground">{comparedTo}</p>
      </div>

      {/* Main Value */}
      <div className="text-3xl font-bold mt-1">
        {totalUsers.toLocaleString()}
      </div>

      {/* Change */}
      <div
        className={`flex items-center text-sm ${
          trend === 'up'
            ? 'text-green-500'
            : trend === 'down'
            ? 'text-destructive'
            : 'text-muted-foreground'
        }`}
      >
        {trendIcon}
        {percentChange !== null
          ? Math.abs(percentChange).toFixed(1) + '%'
          : '—'}
        <span className="ml-1 text-muted-foreground">vs {comparedTo}</span>
      </div>

      {/* Chart */}
      <div className="absolute right-4 bottom-4 w-[50%] h-[70%] pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Tooltip wrapperStyle={{ display: 'none' }} />
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={
                    trend === 'up'
                      ? '#22C55E'
                      : trend === 'down'
                      ? '#EF4444'
                      : '#A1A1AA'
                  }
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={
                    trend === 'up'
                      ? '#22C55E'
                      : trend === 'down'
                      ? '#EF4444'
                      : '#A1A1AA'
                  }
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="value"
              stroke={
                trend === 'up'
                  ? '#22C55E'
                  : trend === 'down'
                  ? '#EF4444'
                  : '#A1A1AA'
              }
              strokeWidth={2}
              dot={false}
              fill="url(#trendGradient)"
              fillOpacity={1}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
