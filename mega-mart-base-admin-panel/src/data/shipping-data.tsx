

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Box, Clock } from "lucide-react";
export const statsData = [
  {
    title: "Shipping Methods",
    value: "12",
    description: "Active Methods",
    icon: <Truck />,
    iconColor: "#000000",
  },
  {
    title: "Carries",
    value: "8",
    description: "Integrated partners",
    icon: <Box />,
    iconColor: "#C710EB",
  },
  {
    title: "Avg Delivery Time",
    value: "2.4",
    description: "Days Average",
    icon: <Clock />,
    iconColor: "#F97316",
  },
  {
    title: "Shipping revenue",
    value: "$12,450",
    description: "this month",
    icon: <Truck />,
    iconColor: "#22C55E",
  },
];
export const categoryData = [
  {
    label: "Royal mail",
    rate: "1234",
    productCount: "UK",
    color: "bg-red-100 text-red-700",
  },
  {
    label: "DPD",
    rate: "567",
    productCount: "UK/EU",
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "DHL",
    rate: "567",
    productCount: "UK/EU",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    label: "Hermes",
    rate: "890",
    productCount: "UK",
    color: "bg-green-100 text-green-700",
  },
  {
    label: "UPS",
    rate: "23",
    productCount: "Global",
    color: "bg-pink-100 text-pink-700",
  },
];


export const shippingColumns = [
  { header: "Method Name", accessor: "name" },
  { header: "Type", accessor: "type" },
  { header: "Global", accessor: "global" },
  { header: "Amount", accessor: "amount" },
 
  {
    header: "Actions",
    accessor: "actions",
    render: () => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          Edit
        </Button>
        <Button size="sm" variant="outline">
          Rates
        </Button>
      </div>
    ),
  },
];
