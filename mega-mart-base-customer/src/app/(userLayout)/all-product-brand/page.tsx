import AllProductPage from '@/components/AllProduct/AllProduct'
import { Metadata } from 'next';


// export const metadata: Metadata = {
//   title: "MegaMart|Product",
//   description: "Vendor management website",
// };
export default function AllProductPagePage({id}: any) {
  return (
    <div>
      <AllProductPage id={id} />
    </div>
  )
}
