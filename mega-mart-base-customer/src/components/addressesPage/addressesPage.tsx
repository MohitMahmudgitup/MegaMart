"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin } from "lucide-react";
import Link from "next/link";
import { useGetSingleCustomerQuery } from "@/redux/featured/customer/customerApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import Loading from "./loading";

export default function AddressesPage() {
  const user = useAppSelector(selectCurrentUser)

  const {
    data: customer,
    isLoading,
    isError,
    error,
  } = useGetSingleCustomerQuery(user?._id as string, { skip: !user?._id });


  if (isLoading) {
    return <Loading/>
  }

  if (isError) {
    return (
      <p className="p-6 text-sm text-red-600">Error: {JSON.stringify(error)}</p>
    );
  }

  if (!customer?.address?.length) {
return (
  <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
    <div className="text-center max-w-md w-full bg-white border rounded-2xl shadow-sm p-10 space-y-6">

      {/* Icon */}
      <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-orange-100">
        <MapPin className="h-8 w-8 text-orange-600" />
      </div>

      {/* Text */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          No Saved Addresses
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          You haven’t added any shipping addresses yet.
          Add one to make checkout faster.
        </p>
      </div>

      {/* Button */}
      <Link href={`/dashboard/add-new-address`}>
        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-5 text-base">
          <MapPin className="h-4 w-4 mr-2" />
          Add Your First Address
        </Button>
      </Link>

    </div>
  </div>
);
  }

  return (
    <div className="w-full p-6 ">
      <div className="flex items-center justify-between mb-8  ">
        <h1 className="text-2xl font-semibold text-foreground">My Addresses</h1>
        <Link href={`/dashboard/add-new-address`} className="md:hidden">
          <Button
            variant="ghost"
            className="text-orange-600 hover:text-orange-700"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {customer.address.map((addr: any, idx: number) => (
          <Card
            key={idx}
            className={`flex-1 ${
              addr.isDefault
                ? "border-amber-200 bg-amber-50/30"
                : "border-border"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-medium text-foreground">
                      {addr.title || `Address ${idx + 1}`}
                    </h3>
                    {addr.isDefault && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-medium">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1 mb-3">
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state} {addr["zip-code"]}
                    </p>
                    <p>{addr.country}</p>
                    <p>Type: {addr.type}</p>
                  </div>

                  {!addr.isDefault && (
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Set as Default
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden md:flex justify-start mt-6">
        <Link href={`/dashboard/add-new-address`}>
          <Button
            variant="ghost"
            className="text-orange-600 hover:text-orange-700"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </Link>
      </div>
    </div>
  );
}

