import CouponsManageVendor from "@/components/pages/vendor/CouponManagement"


export const metadata = {
  title: 'Coupons Management | Meta Mart',
  description: 'Administer and manage coupons, including adding, editing, and viewing coupon information.',
}

const page = () => {
  return (
    <CouponsManageVendor />
  )
}

export default page
