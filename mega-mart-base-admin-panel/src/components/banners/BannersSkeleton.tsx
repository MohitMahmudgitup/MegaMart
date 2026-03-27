export default function BannersSkeleton() {
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="h-9 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>

        {/* Top Section Skeleton */}
        <div className="grid grid-cols-12 gap-4 h-[200px] md:h-[196px] xl:h-60 mb-4">
          {/* Large Banner Left */}
          <div className="col-span-7">
            <div className="relative w-full h-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
              <div className="absolute top-2 right-2 flex gap-2">
                <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-6 bg-gray-400 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-400 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Medium Banner Right */}
          <div className="col-span-5">
            <div className="relative w-full h-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
              <div className="absolute top-2 right-2 flex gap-2">
                <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-6 bg-gray-400 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-400 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section Skeleton */}
        <div className="grid grid-cols-3 gap-4 h-[410px] md:h-[410px] xl:h-[450px]">
          {/* Left Banner */}
          <div className="relative w-full h-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
            <div className="absolute top-2 right-2 flex gap-2">
              <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="h-6 bg-gray-400 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-400 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>

          {/* Middle Column - Two Stacked Banners */}
          <div className="flex flex-col gap-4">
            {/* Top Small Banner */}
            <div className="relative w-full flex-1 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
              <div className="absolute top-2 right-2 flex gap-2">
                <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-5 bg-gray-400 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-400 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>

            {/* Bottom Small Banner */}
            <div className="relative w-full flex-1 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
              <div className="absolute top-2 right-2 flex gap-2">
                <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-5 bg-gray-400 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-400 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Banner */}
          <div className="relative w-full h-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
            <div className="absolute top-2 right-2 flex gap-2">
              <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="h-6 bg-gray-400 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-400 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
