export default function WithdrawalsSkeleton() {
  return (
    <div className="relative py-6 p-2 sm:p-4">
      {/* Table Container */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="h-7 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <tr key={i} className="border-b border-gray-100">
                  {/* ID */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>

                  {/* Payment Method */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>

                  {/* Card Name */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                  </td>

                  {/* Number */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>

                  {/* Status & Actions */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
