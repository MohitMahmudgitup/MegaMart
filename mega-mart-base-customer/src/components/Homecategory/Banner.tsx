/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import bennar from '../../../public/banner.png';
import Image from 'next/image';
import { useState } from 'react';
import { selectCurrentUser } from '@/redux/featured/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { useCreateVendorMutation } from '@/redux/featured/vendor/vendorApi';
import toast from 'react-hot-toast';
import SuccessMessage from '../shared/SuccessMessage';
import { useRouter } from 'next/navigation';
import { useUpdateUserMutation, useUpdateUserRoleMutation } from '@/redux/featured/user/userApi';

export default function BannerPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter()
  const [VendorCreate, { isLoading }] = useCreateVendorMutation();
  const [updateUserRole] = useUpdateUserRoleMutation()

  const createVendor = async (id: string) => {
    
    try {
      const res = await VendorCreate({ userId: id }).unwrap();

      if (res.success === true) {
       await updateUserRole(user?._id).unwrap()
        setIsOpen(false);
        setIsSuccessModal(true);
      }
    } catch (error) {
    }
  };

  return (
    <div className=" bg-white sm:rounded-lg">
      {/* Main content */}
      <div className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Right content - Hero image (mobile first: on top) */}
          <div className="relative flex justify-center mt-0 lg:mt-0 order-1 lg:order-2">
            <div className="relative w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96">
              {/* Optional soft green glow background */}
              <div className="absolute inset-0 rounded-full bg-green-100/60 blur-2xl -z-10" />

              {/* Person image */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full ring-1 ring-green-200/60">
                <Image
                  src={bennar}
                  alt="Banner Image"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Left content (mobile: below image, desktop: left) */}
          <div className="space-y-6 text-start order-2 lg:order-1">
            <div className="text-white">
              <div className="flex bg-[#F7F7F7] text-black items-center gap-2 text-xs sm:text-sm md:text-base rounded-full px-2 py-1 w-fit">
                <span className="bg-black px-3 sm:px-4 py-1 rounded-full text-white text-xs sm:text-sm">
                  News
                </span>
                <span className="text-xs sm:text-sm md:text-base">
                  Have a look at our updated terms and conditions policy
                </span>
                <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Launch your online store effortlessly with{' '}
              <span className="text-green-500">MegaMart</span> and start selling
              today.
            </h1>

            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
              Transform your business with Chawkbazar&apos;s seamless platform
              and kickstart your online sales instantly. Enjoy a hassle-free
              setup and reach your customers quickly and efficiently.
            </p>

            <div>
              <Button
                className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-md font-medium flex items-center gap-2 text-sm sm:text-base w-fit"
                disabled={user ? user.role !== 'customer' : false}
                onClick={() => {
                  if (!user) {
                    router.push('/auth/login');
                    return;
                  }
                  if (user.role === 'customer') {
                    setIsOpen(true); 
                  }
                }}
              >
                Sign Up Here
                <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4" />
              </Button>

              {/* Popup Modal */}
              {isOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-[40vw] p-6 sm:p-8 relative animate-fadeIn">
                    {/* Close Button */}
                    <button
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      ✕
                    </button>

                    {/* Vendor Illustration */}
                    <div className="flex justify-center mb-6">
                      <div className="bg-green-50 rounded-full p-4 shadow-inner">
                        <Image
                          src="https://png.pngtree.com/png-vector/20230808/ourmid/pngtree-vendor-clipart-man-is-working-behind-a-cart-with-food-cartoon-vector-png-image_6827954.png"
                          alt="Vendor illustration"
                          width={130}
                          height={130}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-900">
                      Sign Up as Vendor
                    </h2>
                    <p className="text-center text-gray-700 mb-6 text-sm sm:text-base">
                      Are you sure you want to register this user as a vendor?
                      Once confirmed, they will gain access to the vendor
                      dashboard to manage products, track orders, and view
                      sales.
                    </p>

                    {/* User Info Card */}
                    {user && (
                      <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 hover:bg-green-50 rounded-full shadow-md border border-gray-200 transition-all duration-300">
                        <Image
                          src={user.image ?? '/default-profile.png'}
                          alt={user.name ?? 'User'}
                          width={60}
                          height={60}
                          className="rounded-full object-cover border-2 border-green-500"
                        />
                        <div className="flex flex-col">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {user.name}
                          </p>
                          <p className="text-gray-500 text-xs sm:text-sm">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-end gap-4">
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow-lg transition-transform hover:scale-105"
                        onClick={() => createVendor(user?._id as string)}
                      >
                        {isLoading ? 'Confirming...' : 'Confirm'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isSuccessModal && (
        <>
          <SuccessMessage user={user} setIsSuccessModal={setIsSuccessModal} />
        </>
      )}
    </div>
  );
}
