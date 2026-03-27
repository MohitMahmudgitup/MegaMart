import { VendorProfile } from "@/components/vendorProfile/vendor-profile/page"
export const metadata = {
  title: 'Vendor Profile | Meta Mart',
  description: 'View and manage your vendor profile, shop details, products, and orders.',
}


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <VendorProfile />
    </div>
  )
}
