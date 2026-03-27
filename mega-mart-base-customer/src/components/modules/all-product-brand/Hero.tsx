import Image from "next/image";

const Hero = ({ brandsData }: any) => {
  if (!brandsData) return null;

  const heroImage = brandsData?.images?.[0]?.image;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 via-white to-purple-50 px-6 py-12 md:px-10 md:py-16 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left content */}
        <div>
          <span className="inline-block mb-3 text-sm font-semibold tracking-wide text-blue-600 uppercase">
            Featured Brand
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 mb-5">
            {brandsData?.name || "Brand Name"}
          </h1>

          <p className="text-gray-600 text-base sm:text-lg max-w-xl">
            {brandsData?.description ||
              "Discover our exclusive collection from this top brand. Premium quality, modern design, and unmatched comfort—crafted just for you."}
          </p>
        </div>

        {/* Right image */}
        <div className="relative flex justify-center md:justify-end">
          {heroImage ? (
            <div className="relative w-full max-w-sm sm:max-w-md h-60 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-white shadow-xl">
              {/* soft glow */}
              <div className="absolute -inset-6 bg-linear-to-r from-blue-200 to-purple-200 opacity-30 blur-3xl" />
              <Image
                src={heroImage}
                alt={brandsData?.name || "Brand Image"}
                fill
                className="relative object-contain p-6"
                priority
              />
            </div>
          ) : (
            <div className="w-64 h-64 rounded-2xl bg-gray-100 flex items-center justify-center shadow-inner">
              <span className="text-gray-400 text-sm">No Image Available</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
