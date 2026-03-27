"use client";
import { useParams } from 'next/navigation';
import ResetPassword from '../page'

const page = () => {
    const params = useParams();
    console.log(params.id);

  return (
    <div>
        <ResetPassword token={params.id} />
    </div>
  )
}

export default page
