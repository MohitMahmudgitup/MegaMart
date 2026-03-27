// Skeleton Loading Component for Best Selling Products
export const BestSellingProductsSkeleton = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-9 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-2xl p-4 sm:p-6 animate-pulse"
          >
            {/* Product Image Skeleton */}
            <div className="aspect-square mb-3 sm:mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>

              {/* Price Skeleton */}
              <div className="flex items-center justify-between pt-1.5 sm:pt-2">
                <div className="h-6 bg-gray-300 rounded w-20"></div>
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
