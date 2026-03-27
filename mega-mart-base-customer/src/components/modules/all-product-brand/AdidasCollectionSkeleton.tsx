// Skeleton Loading Component for Adidas Collection
export const AdidasCollectionSkeleton = () => {
  return (
    <section className="w-full py-12">
      {/* Header Skeleton */}
      <div className="flex md:items-center justify-between mb-8 gap-4">
        <div className="h-8 bg-gray-200 rounded w-56 animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-2 px-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div
            key={i}
            className="rounded-2xl w-full lg:w-[220px] h-[320px] bg-gray-100 border-none shadow-sm animate-pulse"
          >
            <div className="flex flex-col justify-between h-full p-4">
              {/* Image Skeleton */}
              <div className="w-full h-[150px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-2"></div>

              {/* Info Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Price + Arrow Skeleton */}
              <div className="flex items-center justify-between mt-3">
                <div className="h-6 bg-gray-300 rounded w-20"></div>
                <div className="rounded-full w-9 h-9 bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
