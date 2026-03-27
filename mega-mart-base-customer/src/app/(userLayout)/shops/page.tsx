import AllSops from '@/components/AllSops/AllSops'
import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
  title: "MegaMart|Shops",
  description: "Vendor management website",
};
export default function AllShopPage() {
  return (
    <div>
      <AllSops />
    </div>
  )
}
