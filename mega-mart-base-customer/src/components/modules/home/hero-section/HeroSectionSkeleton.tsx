// Skeleton Loading Component
export const HeroSectionSkeleton = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="w-full lg:w-64 bg-white rounded-lg p-4 space-y-4">
        {/* Category Items */}
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}

        {/* Popular Products & Gift Packages */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
        </div>

        {/* Button */}
        <div className="pt-4">
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>

      {/* Main Banner Grid Skeleton - Exact Match to Image */}
      <div className="flex-1 space-y-4">
        {/* Top Row - 2 Large Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large Banner 1 - Woman in Yellow Top */}
          <div className="h-64 md:col-span-2 md:h-50 bg-gradient-to-br from-indigo-100 via-purple-50 to-amber-50 rounded-3xl p-6 relative overflow-hidden">
            {/* Text at top left */}
            <div className="absolute top-6 left-6 space-y-2">
              <div className="h-3 bg-gray-400/60 rounded w-36"></div>
              <div className="h-7 bg-gray-500/70 rounded w-28 font-bold"></div>
            </div>
            {/* Arrow button at bottom left */}
            <div className="absolute bottom-6 left-6">
              <div className="w-14 h-14 bg-white rounded-full shadow-md"></div>
            </div>
            {/* Person silhouette on right */}
            <div className="absolute right-0 bottom-0 w-48 h-56 bg-gray-300/20"></div>
          </div>

          {/* Large Banner 2 - Man with Sunglasses */}
          <div className="h-64 md:h-50 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 rounded-3xl p-6 relative overflow-hidden">
            {/* Discount badge at top left */}
            <div className="absolute top-6 left-6">
              <div className="h-8 bg-gray-900 rounded-full w-24"></div>
            </div>
            {/* Title below badge */}
            <div className="absolute top-20 left-6">
              <div className="h-6 bg-gray-500/70 rounded w-20"></div>
            </div>
            {/* Arrow button at bottom left */}
            <div className="absolute bottom-6 left-6">
              <div className="w-14 h-14 bg-white rounded-full shadow-md"></div>
            </div>
            {/* Person silhouette on right */}
            <div className="absolute right-0 bottom-0 w-48 h-56 bg-gray-300/20"></div>
          </div>
        </div>

        {/* Bottom Row - 4 Medium Banners */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Banner 1 - Girl in Floral Top */}
          <div className="h-56 md:col-span-2 md:h-72 bg-gradient-to-br from-gray-50 to-slate-100 rounded-3xl p-4 relative overflow-hidden">
            {/* Arrow at bottom left */}
            <div className="absolute bottom-4 left-4">
              <div className="w-12 h-12 bg-white rounded-full shadow-md"></div>
            </div>
            {/* Person silhouette */}
            <div className="absolute right-0 bottom-0 w-32 h-48 bg-gray-300/20"></div>
          </div>

          <div className="flex flex-col gap-y-2  md:col-span-2">
            {/* Banner 2 - Watch */}
            <div className="h-56 md:h-35 bg-gradient-to-br from-gray-100 to-slate-200 rounded-3xl p-4 relative overflow-hidden flex flex-col justify-between">
              {/* Watch circle in center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-14 h-14 bg-gray-300/40 rounded-full"></div>
              </div>
              {/* "see watch" text at bottom */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="h-4 bg-gray-400/60 rounded w-14"></div>
              </div>
            </div>

            {/* Banner 3 - Shoes */}
            <div className="h-56 md:h-35 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-3xl p-4 relative overflow-hidden flex flex-col justify-between">
              {/* Shoe silhouette in center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-18 h-10 bg-gray-800/30 rounded-2xl"></div>
              </div>
              {/* "SEE Shop" text at bottom */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="h-4 bg-gray-500/60 rounded w-14"></div>
              </div>
            </div>
          </div>

          {/* Banner 4 - Woman in Brown Top */}
          <div className="h-56  md:col-span-2 md:h-72 bg-gradient-to-br from-gray-50 to-slate-100 rounded-3xl p-4 relative overflow-hidden">
            {/* Arrow at top right */}
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 bg-white rounded-full shadow-md"></div>
            </div>
            {/* Person silhouette */}
            <div className="absolute right-0 bottom-0 w-32 h-48 bg-gray-300/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};