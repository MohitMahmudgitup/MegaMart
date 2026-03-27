export default function CategoryManagementSkeleton() {
  return (
    <div className="space-y-6 py-6">
      {/* Add Category Button Skeleton */}
      <div className="flex justify-end">
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
      </div>

      {/* Category Table Skeleton */}
      <div className="bg-white rounded-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="h-7 bg-gray-200 rounded w-56 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <tr key={i} className="border-b border-gray-100">
                  {/* Category Name */}
                  <td className="py-4 px-4">
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </td>

                  {/* Subcategories Count */}
                  <td className="py-4 px-4">
                    <div className="h-5 bg-gray-200 rounded w-8 animate-pulse"></div>
                  </td>

                  {/* Description */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-4 px-4">
                    <div className="h-6 bg-gray-200 rounded-full w-11 animate-pulse"></div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
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
    </div>
  );
}
