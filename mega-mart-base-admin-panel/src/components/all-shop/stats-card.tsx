"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  color: string
}

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <Card className="bg-white shadow-sm rounded-lg">
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  )
}