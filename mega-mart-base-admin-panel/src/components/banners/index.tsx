"use client";

import { useCreateBannerMutation, useDeleteBannerMutation, useGetAllBannersQuery } from "@/redux/featured/Banner/bannerApi";
import { BannerCard, Banner } from "./BannerCard";
import BannerCreateUpdate from "./BannerModal";
import Swal from "sweetalert2";
import BannersSkeleton from "./BannersSkeleton";

export default function SixHeroBanners() {
  const { data, refetch, isLoading } = useGetAllBannersQuery();
  const [deleteBanner] = useDeleteBannerMutation();

  const deleteHangle = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteBanner(id);
        refetch();
        Swal.fire("Deleted!", "Banner has been deleted.", "success");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const banners: Banner[] = data?.banners || [];
  // Fill array up to 6 items with null for placeholders
  const bannerList: (Banner | null)[] = Array.from({ length: 6 }, (_, i) => banners[i] || null);
  if (isLoading) return <BannersSkeleton/>
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          {banners.length < 6 && (
            <BannerCreateUpdate refetch={refetch}>
              Add New Banner
            </BannerCreateUpdate>
          )}
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-12 gap-4 h-[200px] md:h-[196px] xl:h-60 mb-4">
          <div className="col-span-7">
            <BannerCard banner={bannerList[0]} refetch={refetch} onDelete={deleteHangle} />
          </div>
          <div className="col-span-5">
            <BannerCard banner={bannerList[1]} refetch={refetch} onDelete={deleteHangle} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-4 h-[410px] md:h-[410px] xl:h-[450px]">
          <BannerCard banner={bannerList[2]} refetch={refetch} onDelete={deleteHangle} />
          <div className="flex flex-col gap-4">
            <BannerCard banner={bannerList[3]} refetch={refetch} onDelete={deleteHangle} />
            <BannerCard banner={bannerList[4]} refetch={refetch} onDelete={deleteHangle} />
          </div>
          <BannerCard banner={bannerList[5]} refetch={refetch} onDelete={deleteHangle} />
        </div>
      </div>
    </div>
  );
}
