import { saveMoreData } from "@/data/save-more";
import SectionHeader from "../new-arrivals/SectionHeader";

const SaveMore = () => {
  return (
    <section className="py-10 bg-white md:rounded-2xl px-4 md:px-6">
      <SectionHeader title="Save More, Risk Nothing" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
        {saveMoreData.map((data, index) => {
          const Icon = data.icon;

          return (
            <div
              key={index}
              className="group bg-white rounded-2xl p-5 flex flex-col items-center text-center
              shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center rounded-full 
              bg-gray-100 mb-4 group-hover:bg-black transition">
                <Icon
                  className={`w-7 h-7 ${data.iconColor || "text-black"
                    } group-hover:text-white transition`}
                  strokeWidth={1.8}
                />
              </div>

              {/* Title */}
              <h3 className="font-semibold text-[13px] md:text-base lg:text-lg text-gray-900 tracking-tight leading-snug mb-1">
                {data.title}
              </h3>

              {/* Description */}
              <p className="text-[11px] md:text-sm text-gray-500 leading-relaxed tracking-wide">
                {data.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SaveMore;