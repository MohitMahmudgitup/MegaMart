import CategoryRouteSection from "@/components/modules/category/CategoryRouteSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CartX | Category",
  description: "Vendor management website",
};

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params; 
  return <CategoryRouteSection slug={slug} />;
}
