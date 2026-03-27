// Skeleton Loading Component for Slider
export const SliderSkeleton = () => {
  return (
    <section className="w-full flex justify-center items-center py-6 sm:py-8 lg:py-10">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl">
        <div
          className="
            relative w-full 
            h-[180px]   
            sm:h-[220px] 
            md:h-[300px] 
            lg:h-[360px] 
            xl:h-[420px] 
            rounded-2xl overflow-hidden
            bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse
          "
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Pagination Dots Skeleton */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};
