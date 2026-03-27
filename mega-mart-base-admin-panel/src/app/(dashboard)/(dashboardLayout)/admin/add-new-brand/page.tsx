"use client";
import CreateBrand from '@/components/pages/admin/CreateBrand';
import { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    document.title = "Create New Brand | CartX";
  }, []);

  return <CreateBrand />;
};

export default Page;
