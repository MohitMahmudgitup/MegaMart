// Skeleton Loading Component for Top Brands
export const TopBrandsSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className="flex md:mt-5 mt-3 flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Title */}
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      {/* Brands Skeleton */}
      <div className="w-full h-14 md:h-44 overflow-hidden flex items-center gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="relative w-14 h-14 md:w-34 md:h-34 flex-shrink-0 rounded-full bg-gray-200 animate-pulse"
          ></div>
        ))}
      </div>
    </>
  );
};
