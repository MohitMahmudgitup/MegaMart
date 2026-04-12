import Image from "next/image";

const Hero = ({ brandsData }: any) => {
  if (!brandsData) return null;

  const heroImage = brandsData?.images?.[0]?.image;

  return (
    <section className="relative overflow-hidden rounded-2xl min-h-[400px] md:min-h-[500px] flex items-center">
      
      {/* Background Image */}
      {heroImage && (
        <Image
          src={heroImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-12 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          {/* Left Content */}
          <div className="text-white">
            <span className="inline-block mb-3 text-xs sm:text-sm font-semibold tracking-widest text-blue-300 uppercase">
              Featured Brand
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              {brandsData?.name || "Brand Name"}
            </h1>

            <p className="text-gray-200 text-sm sm:text-base max-w-xl">
              {brandsData?.description ||
                "Discover our exclusive collection from this top brand. Premium quality, modern design, and unmatched comfort—crafted just for you."}
            </p>

            {/* CTA Button */}
            <button className="mt-6 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition">
              Explore Now
            </button>
          </div>

          {/* Right Card Image */}
          <div className="flex justify-center md:justify-end">
            {heroImage ? (
              <div className="relative w-full max-w-sm h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
                
                <Image
                  src={heroImage}
                  alt={brandsData?.name || "Brand Image"}
                  fill
                  className="object-contain p-6"
                />
              </div>
            ) : (
              <div className="w-64 h-64 rounded-2xl bg-white/20 flex items-center justify-center">
                <span className="text-gray-300 text-sm">
                  No Image Available
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;