"use client";

import { useParams } from "next/navigation";
import ProductDetailsPage from "../page"; 

export default function SingleProductPage() {
  const params = useParams();
  const id = params?.id as string;
   const productId = id?.split("-").pop();


  return <ProductDetailsPage productId={productId} />;
}
