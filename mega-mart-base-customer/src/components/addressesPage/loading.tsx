export default function Loading() {
  return (
    <div className="py-6 p-2 sm:p-4">
      {/* Header Skeleton */}
      <div className="flex flex-col xl:flex-row items-center justify-between mb-6 gap-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>

      {/* Addresses Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow border border-gray-200 p-6"
          >
            {/* Address Type Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Name */}
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>

            {/* Address Lines */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>

            {/* Phone */}
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <div className="h-9 bg-gray-200 rounded flex-1 animate-pulse"></div>
              <div className="h-9 bg-gray-200 rounded flex-1 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
