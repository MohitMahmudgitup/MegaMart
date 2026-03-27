"use client";
import AllProductPagePage from '../page'
import { useParams } from "next/navigation";

const page = () => {
    const params = useParams();
     const id = params?.id as string;

  return (
    <div>
      <AllProductPagePage id={id} />
    </div>
  )
}

export default page
