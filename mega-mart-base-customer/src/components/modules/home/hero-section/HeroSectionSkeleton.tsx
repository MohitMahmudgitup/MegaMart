export const HeroSectionSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 animate-pulse">
      
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-white rounded-2xl p-4 space-y-4">
        
        {/* Categories */}
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-gray-100">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded"></div>
          </div>
        ))}

        {/* Extra Links */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>

        {/* Button */}
        <div className="pt-4">
          <div className="h-9 sm:h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">

        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Large Banner 1 */}
          <div className="h-48 sm:h-56 md:h-52 lg:h-56 md:col-span-2 bg-gradient-to-br from-indigo-100 via-purple-50 to-amber-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
            
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 space-y-2">
              <div className="h-3 bg-gray-400/60 rounded w-28 sm:w-36"></div>
              <div className="h-5 sm:h-7 bg-gray-500/70 rounded w-20 sm:w-28"></div>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full shadow-md"></div>
            </div>

            <div className="absolute right-0 bottom-0 w-32 sm:w-40 md:w-48 h-40 sm:h-48 md:h-56 bg-gray-300/20"></div>
          </div>

          {/* Large Banner 2 */}
          <div className="h-48 sm:h-56 md:h-52 lg:h-56 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
            
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
              <div className="h-6 sm:h-8 bg-gray-900 rounded-full w-16 sm:w-24"></div>
            </div>

            <div className="absolute top-14 sm:top-20 left-4 sm:left-6">
              <div className="h-4 sm:h-6 bg-gray-500/70 rounded w-16 sm:w-20"></div>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full shadow-md"></div>
            </div>

            <div className="absolute right-0 bottom-0 w-32 sm:w-40 md:w-48 h-40 sm:h-48 md:h-56 bg-gray-300/20"></div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          
          {/* Banner 1 */}
          <div className="h-48 sm:h-56 md:col-span-2 md:h-64 lg:h-72 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl sm:rounded-3xl p-4 relative overflow-hidden">
            <div className="absolute bottom-4 left-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-md"></div>
            </div>
            <div className="absolute right-0 bottom-0 w-28 sm:w-32 h-40 sm:h-48 bg-gray-300/20"></div>
          </div>

          {/* Middle Column */}
          <div className="flex flex-col gap-4 md:col-span-2">
            
            <div className="h-40 sm:h-48 md:h-32 lg:h-36 bg-gradient-to-br from-gray-100 to-slate-200 rounded-2xl sm:rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-300/40 rounded-full"></div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="h-3 sm:h-4 bg-gray-400/60 rounded w-12 sm:w-14"></div>
              </div>
            </div>

            <div className="h-40 sm:h-48 md:h-32 lg:h-36 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-2xl sm:rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-6 sm:w-16 sm:h-8 bg-gray-800/30 rounded-2xl"></div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="h-3 sm:h-4 bg-gray-500/60 rounded w-12 sm:w-14"></div>
              </div>
            </div>
          </div>

          {/* Banner 4 */}
          <div className="h-48 sm:h-56 md:col-span-2 md:h-64 lg:h-72 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl sm:rounded-3xl p-4 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-md"></div>
            </div>
            <div className="absolute right-0 bottom-0 w-28 sm:w-32 h-40 sm:h-48 bg-gray-300/20"></div>
          </div>
        </div>

      </div>
    </div>
  );
};