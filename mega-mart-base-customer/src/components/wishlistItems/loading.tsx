export default function Loading() {
  return (
    <div className="py-6 p-2 sm:p-4">
      {/* Header Skeleton */}
      <div className="flex flex-col xl:flex-row items-center justify-between mb-6 gap-4">
        <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      {/* Wishlist Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, ].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
          >
            {/* Image Skeleton */}
            <div className="relative w-full h-16 bg-gray-200 animate-pulse"></div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              
              {/* Price */}
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
