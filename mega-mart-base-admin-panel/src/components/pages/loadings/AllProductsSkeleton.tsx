export default function AllProductsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6">
      <div className="w-full space-y-6">
        {/* Header Actions Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Category Cards Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar Skeleton */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-200 rounded-full w-32 animate-pulse"
                ></div>
              ))}
            </div>
            {/* Search Bar */}
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Product Table Skeleton */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-6 gap-4">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="p-4">
                <div className="grid grid-cols-6 gap-4 items-center">
                  {/* Product Image & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>

                  {/* Price */}
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>

                  {/* Stock */}
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>

                  {/* Status */}
                  <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center gap-2">
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
