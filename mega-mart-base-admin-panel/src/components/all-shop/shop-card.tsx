"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { EditShopDialog } from "./EditShopDialog"
import Link from "next/link"
import { useDeleteShopMutation } from "@/redux/featured/shop/shopApi"
import { useAppSelector } from "@/redux/hooks"
import { selectCurrentUser } from "@/redux/featured/auth/authSlice"
import toast from "react-hot-toast"

interface ShopCardProps {
  shop: {
    id: number
    name: string
    tagline: string
    description: string
    location: string
    created: string
    revenue: string
    orders: string
    products: string
    avatar: string
    coverImage: string
  }
  onView: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number) => void
    refetchShops: () => void
}

export function ShopCard({ shop, onView, onDelete, onEdit, refetchShops }: ShopCardProps) {
  const [deleteShop] = useDeleteShopMutation()
  const currentUser = useAppSelector(selectCurrentUser);

 const hendlarDelete = async (id: any) => {
  try {
    await deleteShop({
      shopId: id,
      deletedBy: currentUser?._id!,
    }).unwrap()

    toast.success("Shop deleted successfully!")
    refetchShops()
  } catch (error) {
    toast.error("Failed to delete shop")
  }
}

  return (
    <>
      <Card className="bg-white hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-gray-900 text-white">
                <Image
                  src={
                    shop.avatar ||
                    "https://res.cloudinary.com/dvbnagad5/image/upload/v1758188823/defaultshop_vwj3mw.png"
                  }
                  alt="Shop"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Avatar>

              <div>
                <h3 className="font-semibold text-gray-900">{shop.name}</h3>
                <p className="text-sm text-gray-500">{shop.tagline}</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(shop.id)}>
                  View Details
                </DropdownMenuItem>
                <Link href={`/admin/edit-shop/${shop.id}`}>
                  <DropdownMenuItem>
                    Edit Shop
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => hendlarDelete(shop.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-gray-600 text-sm mb-4">{shop.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              {shop.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {shop.created}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-center">
              <p className="font-semibold">{shop.revenue}</p>
              <p className="text-xs text-gray-500">Revenue</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{shop.orders}</p>
              <p className="text-xs text-gray-500">Orders</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{shop.products}</p>
              <p className="text-xs text-gray-500">Products</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
