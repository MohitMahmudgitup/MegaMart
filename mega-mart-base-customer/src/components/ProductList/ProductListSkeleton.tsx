// Skeleton Loading Component for Product Listing
export const ProductListSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-screen-2xl w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-9 bg-gray-200 rounded w-24 animate-pulse lg:hidden"></div>
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar Skeleton - Desktop Only */}
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              
              {/* Filter Sections Skeleton */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="mb-6">
                  <div className="h-5 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
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
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
