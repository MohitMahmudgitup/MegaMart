import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Plus, Heart } from "lucide-react";
import Link from "next/link";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard";
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "visa",
    lastFour: "4242",
    expiryMonth: "12",
    expiryYear: "25",
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    lastFour: "5678",
    expiryMonth: "09",
    expiryYear: "24",
    isDefault: false,
  },
];

export default function PaymentMethods() {
  return (
    <>
      {/* Main content */}
      <div className="space-y-6  min-h-screen w-full ">
        {/* Header with top-right action */}
      <div className="p-6 rounded-2xl border border-gray-200 bg-linear-to-r from-orange-50 to-white">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
                  My Payment Methods
            </h1>
            <p className="text-gray-600 text-sm">
              Save your favorite products and add them to cart anytime.
            </p>
          </div>
        </div>
      </div>
        <div className="flex items-center justify-between gap-2">

        

          {/* Top button: visible on <md, hidden on md+ */}
          <Link
            href={`/dashboard/edit-payment-method`}
            className="shrink-0 md:hidden"
          >
            <Button
              variant="link"
              className="text-orange-600 text-xs hover:text-orange-700 p-0 h-auto"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add New Payment Method
            </Button>
          </Link>
        </div>

        <div className="space-y-4 ">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`w-full rounded-xl shadow-sm border bg-[#FFFFFF] ${
                method.isDefault ? "border-emerald-200" : "border-gray-200"
              } p-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left: brand + number + expiry */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                    {method.type === "visa" ? "V" : "M"}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground capitalize text-sm sm:text-base">
                        {method.type} •••• {method.lastFour}
                      </span>

                      {method.isDefault && (
                        <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!method.isDefault && (
                    <Button
                      variant="link"
                      className="hidden sm:inline-flex text-orange-600 hover:text-orange-700 p-0 h-auto"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom button: hidden on mobile, shown on md+ */}
    <div className="hidden md:block pt-4 pb-6">
  <div className="border border-dashed border-orange-300 bg-orange-50/40 rounded-2xl p-6 flex items-center justify-between hover:bg-orange-50 transition">

    <div>
      <h3 className="text-sm font-semibold text-gray-800">
        Add a New Payment Method
      </h3>
      <p className="text-xs text-gray-500 mt-1">
        Securely save cards for faster checkout
      </p>
    </div>

    <Link href={`/dashboard/edit-payment-method`}>
      <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-5">
        <Plus className="w-4 h-4 mr-2" />
        Add New
      </Button>
    </Link>

  </div>
</div>
      </div>
    </>
  );
}
