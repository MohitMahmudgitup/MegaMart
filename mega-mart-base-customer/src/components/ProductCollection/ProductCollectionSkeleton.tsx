// Skeleton Loading Component for Product Collection
export const ProductCollectionSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Title Skeleton */}
        <div className="flex justify-center mb-8">
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Left Sidebar Skeleton */}
          <aside className="hidden lg:block lg:w-80 lg:sticky lg:top-24 self-start">
            <div className="space-y-6">
              {/* Filter Cards Skeleton */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-lg border p-6">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* Top Controls Skeleton */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse lg:hidden"></div>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-9 w-9 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="bg-white rounded-lg border overflow-hidden animate-pulse">
                  {/* Image Skeleton */}
                  <div className="w-full aspect-square bg-gradient-to-br from-gray-200 to-gray-300">
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Content Skeleton */}
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-9 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
