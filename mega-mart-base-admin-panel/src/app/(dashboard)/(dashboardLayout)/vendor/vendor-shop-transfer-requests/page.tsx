import ShopTransferRequests from "@/components/vendor-ShopTransferRequests/shopTransferRequests/page";
export const metadata = {
  title: 'Shop Transfer Requests | Meta Mart',
  description: 'Manage and review shop transfer requests efficiently within the Meta Mart vendor dashboard.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ShopTransferRequests />
    </div>
  )
}
