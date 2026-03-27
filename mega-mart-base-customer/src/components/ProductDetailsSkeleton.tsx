import { Card, CardContent } from "@/components/ui/card";

export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT: media skeleton */}
        <div>
          {/* Main image skeleton */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200" />

          {/* Thumbnails skeleton */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-200"
              />
            ))}
          </div>
        </div>

        {/* RIGHT: details skeleton */}
        <div>
          {/* Badges skeleton */}
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
            <div className="h-5 w-20 bg-gray-200 rounded-full" />
          </div>

          {/* Title skeleton */}
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-6 bg-gray-200 rounded w-full mb-2" />
          <div className="h-6 bg-gray-200 rounded w-2/3" />

          {/* Categories skeleton */}
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-28 bg-gray-200 rounded" />
          </div>

          {/* Rating skeleton */}
          <div className="flex items-center gap-2 mt-3">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>

          {/* Price skeleton */}
          <div className="flex items-center gap-3 mt-4">
            <div className="h-10 w-32 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>

          {/* Stock skeleton */}
          <div className="mt-3">
            <div className="h-4 w-48 bg-gray-200 rounded" />
          </div>

          {/* Color picker skeleton */}
          <div className="mt-6">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="flex gap-2 flex-wrap">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-20 bg-gray-200 rounded-md" />
              ))}
            </div>
          </div>

          {/* Size picker skeleton */}
          <div className="mt-6">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-12 bg-gray-200 rounded-md" />
              ))}
            </div>
          </div>

          {/* Quantity skeleton */}
          <div className="mt-6">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gray-200 rounded" />
              <div className="h-6 w-8 bg-gray-200 rounded" />
              <div className="h-10 w-10 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="mt-6 space-y-2">
            <div className="h-12 w-full bg-gray-200 rounded-md" />
            <div className="h-12 w-full bg-gray-200 rounded-md" />
          </div>

          {/* Guarantees skeleton */}
          <div className="flex justify-center flex-wrap items-center gap-8 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-7 w-7 bg-gray-200 rounded-full" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose skeleton */}
      <div className="mt-10">
        <div className="h-6 w-64 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-xl p-5 text-center">
              <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-gray-200" />
              <div className="h-5 w-32 bg-gray-200 rounded mx-auto mb-2" />
              <div className="h-4 w-full bg-gray-200 rounded mb-1" />
              <div className="h-4 w-3/4 bg-gray-200 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Specifications skeleton */}
      <div className="space-y-4 mt-10">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <Card className="p-4">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-0">
            {/* Product Details skeleton */}
            <div>
              <div className="h-5 w-32 bg-gray-200 rounded mb-3" />
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex justify-between border-b pb-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Features skeleton */}
            <div className="space-y-5">
              <div>
                <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 w-full bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-3/4 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="h-5 w-36 bg-gray-200 rounded mb-3" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 w-full bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Reviews skeleton */}
      <div className="space-y-4 mt-10">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="border rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-full bg-gray-200 rounded mb-1" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Vouchers skeleton */}
      <div className="w-full mx-auto mt-10">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex items-center flex-1 p-4 gap-4">
                  <div className="h-8 w-16 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-full bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 w-full sm:w-32 border-t sm:border-t-0 sm:border-l border-gray-200">
                  <div className="h-6 w-20 bg-gray-200 rounded mb-1" />
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Related Products skeleton */}
      <div className="w-full mx-auto mt-8">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="p-3 h-[250px] md:h-[320px] rounded-xl border border-gray-200"
            >
              <div className="relative w-full h-40 mb-3 bg-gray-200 rounded" />
              <div className="flex flex-col">
                <div className="h-5 w-full bg-gray-200 rounded mb-2" />
                <div className="h-5 w-24 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
