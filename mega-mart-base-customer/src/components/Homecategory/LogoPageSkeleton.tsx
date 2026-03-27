// Skeleton Loading Component for Logo Page
export const LogoPageSkeleton = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="px-4 py-16">
        <div className="text-center">
          {/* Title Skeleton */}
          <div className="flex justify-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>

          {/* Brands Grid Skeleton */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-7">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center justify-center flex-shrink-0 rounded-lg relative w-[140px] h-[170px] p-4 sm:p-5 md:p-6 bg-gray-100 animate-pulse"
              >
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
              </div>
            ))}
          </div>

          {/* Pagination Dot Skeleton */}
          <div className="flex justify-center mt-8">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  );
};
