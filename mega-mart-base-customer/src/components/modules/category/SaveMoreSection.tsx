import { Wallet, HandHeart, Truck, BadgeCheck } from "lucide-react";

export default function SaveMoreSection() {
  return (
<section className="py-16 px-6 md:rounded-lg">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-left">
      Save More, Risk Nothing
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card */}
      <div className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-indigo-50 group-hover:bg-indigo-600 transition">
          <Wallet className="w-7 h-7 text-indigo-600 group-hover:text-white transition" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Guaranteed Savings</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          If you don’t make your membership fee in savings, we’ll refund the difference.
        </p>
      </div>

      {/* Card */}
      <div className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-rose-50 group-hover:bg-rose-500 transition">
          <HandHeart className="w-7 h-7 text-rose-500 group-hover:text-white transition" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Try It Risk-Free</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Shop with confidence knowing you’re protected every step of the way.
        </p>
      </div>

      {/* Card */}
      <div className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-emerald-50 group-hover:bg-emerald-500 transition">
          <Truck className="w-7 h-7 text-emerald-500 group-hover:text-white transition" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Super Fast Delivery</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Get your products delivered quickly and reliably, every time.
        </p>
      </div>

      {/* Card */}
      <div className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-violet-50 group-hover:bg-violet-600 transition">
          <BadgeCheck className="w-7 h-7 text-violet-600 group-hover:text-white transition" />
        </div>
        <h3 className="font-semibold text-lg mb-2">
          1K+ Products at Cost
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Premium products priced fairly without hidden markups.
        </p>
      </div>
    </div>
  </div>
</section>

  );
}