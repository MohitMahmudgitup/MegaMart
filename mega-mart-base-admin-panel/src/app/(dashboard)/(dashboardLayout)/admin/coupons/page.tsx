import HardcodedCoupons from "@/components/pages/admin/HardcodedCoupons"


export const metadata = {
  title: 'Coupons Management | Meta Mart',
  description: 'Administer and manage coupons, including adding, editing, and viewing coupon information.',
}

const page = () => {
  return (
   <HardcodedCoupons />
  )
}

export default page
