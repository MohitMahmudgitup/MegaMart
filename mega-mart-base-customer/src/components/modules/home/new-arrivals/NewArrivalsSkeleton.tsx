// Skeleton Loading Component
export const NewArrivalsSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className="flex md:mt-5 mt-3 flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Title */}
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Product Cards Grid Skeleton */}
      <section className="mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                </div>
              </div>

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>

                {/* Subtitle */}
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>

                {/* Price */}
                <div className="h-5 bg-gray-300 rounded w-20"></div>

                {/* Button */}
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Button Skeleton */}
      <div className="flex justify-center mt-10">
        <div className="h-12 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
      </div>
    </>
  );
};