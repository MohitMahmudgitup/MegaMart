"use client";

import { Card } from "@/components/ui/card";
import { useGetAllTermsQuery } from "@/redux/featured/terms/termsApi";

export default function TermsPage() {
  // Fetch all terms
  const { data: terms, isLoading, isError } = useGetAllTermsQuery();

  if (isLoading) {
    return <p className="text-center mt-8">Loading terms...</p>;
  }

  if (isError || !terms || terms.length === 0) {
    return <p className="text-center mt-8 text-red-500">No terms found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6 md:p-8">
      {terms.map((term: any) => (
        <Card key={term._id} className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-orange-500">{term.name}</h2>
          <p className="text-sm text-gray-700">{term.description}</p>
          <div className="text-xs text-gray-500">
            Type: {term.type} | Created:{" "}
            {new Date(term.createdAt).toLocaleDateString()}
          </div>
        </Card>
      ))}
    </div>
  );
}
