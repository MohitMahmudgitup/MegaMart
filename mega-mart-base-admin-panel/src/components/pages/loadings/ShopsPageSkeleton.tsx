export default function ShopsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters Skeleton */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
        </div>

        {/* Shops Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
            >
              {/* Cover Image Skeleton */}
              <div className="relative h-32 bg-gray-200 animate-pulse">
                {/* Logo Skeleton */}
                <div className="absolute -bottom-8 left-4 w-16 h-16 bg-gray-300 rounded-full border-4 border-white animate-pulse"></div>
              </div>

              {/* Content Skeleton */}
              <div className="pt-10 p-4 space-y-3">
                {/* Shop Name */}
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>

                {/* Tagline */}
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                </div>

                {/* Location & Date */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="text-center space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <div className="h-9 bg-gray-200 rounded flex-1 animate-pulse"></div>
                  <div className="h-9 w-9 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-9 w-9 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center gap-2 pt-4">
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
