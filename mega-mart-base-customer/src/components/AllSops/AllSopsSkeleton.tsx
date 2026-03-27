// Skeleton Loading Component for All Shops
export const AllSopsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Search Bar Skeleton */}
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
        <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded flex-1 mx-2 animate-pulse"></div>
      </div>

      {/* Shops Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="border rounded-xl p-4 shadow-sm animate-pulse"
          >
            {/* Top Row Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="mt-2 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Products & Rating Skeleton */}
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>

            {/* Address Skeleton */}
            <div className="flex gap-1 mt-2">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
            </div>

            {/* Button Skeleton */}
            <div className="mt-4 h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
