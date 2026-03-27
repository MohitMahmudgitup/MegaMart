export default function OrderPageSkeleton() {
  return (
    <>
      {/* Search and Filter Section Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pt-6">
        <div className="relative w-full sm:w-1/3">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>

      {/* Table Container Skeleton */}
      <div className="grow bg-white p-5 rounded-b-md shadow-sm mb-2.5">
        <div className="overflow-x-auto">
          <table className="min-w-[678px] w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <tr key={i} className="border-b border-gray-100">
                  {/* View Button */}
                  <td className="py-4 px-4 text-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
                  </td>

                  {/* Order ID */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                  </td>

                  {/* Total */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center">
                    <div className="h-6 bg-gray-200 rounded-full w-24 mx-auto animate-pulse"></div>
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-4 text-center">
                    <div className="h-9 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </>
  );
}
