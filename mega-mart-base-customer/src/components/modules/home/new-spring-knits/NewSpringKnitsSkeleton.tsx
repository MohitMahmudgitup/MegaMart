// Skeleton Loading Component for New Spring Knits
export const NewSpringKnitsSkeleton = () => {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="flex md:mt-5 mt-3 flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Title */}
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      {/* Product Cards Grid Skeleton */}
      <section className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-gray-100 relative animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="relative w-full h-[145px] md:h-[252px] lg:h-[312px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl mt-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Button Skeleton (desktop) */}
              <div className="absolute bottom-5 xl:bottom-10 left-1/2 -translate-x-1/2">
                <div className="hidden md:block h-12 bg-gray-200 rounded-xl w-48"></div>
              </div>

              {/* Badge Skeleton */}
              <div className="absolute top-2 md:top-3 left-2 md:left-3">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Button Skeleton */}
      <div className="flex md:hidden justify-center mt-10">
        <div className="h-14 bg-gray-200 rounded-xl w-full md:w-48 animate-pulse"></div>
      </div>
    </div>
  );
};
