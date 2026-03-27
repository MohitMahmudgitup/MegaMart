// Skeleton Loading Component for Discount
export const DiscountSkeleton = () => {
  return (
    <section className="w-full py-12">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="h-8 bg-gray-200 rounded w-56 animate-pulse"></div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 px-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-2xl w-full lg:w-[220px] bg-gray-100 border-none shadow-sm animate-pulse"
          >
            <div className="flex flex-col p-4">
              {/* Image Skeleton */}
              <div className="w-full lg:h-40 md:h-32 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4"></div>

              {/* Info Skeleton */}
              <div className="flex-grow space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Price + Arrow Skeleton */}
              <div className="flex items-center justify-between mt-4">
                <div className="h-6 bg-gray-300 rounded w-20"></div>
                <div className="rounded-full w-8 h-8 md:w-9 md:h-9 bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Button Skeleton */}
      <div className="flex justify-center mt-10">
        <div className="h-12 bg-gray-200 rounded-xl w-56 animate-pulse"></div>
      </div>
    </section>
  );
};
