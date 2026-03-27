/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, ShoppingCart, Filter, X } from "lucide-react"
import Image from "next/image"
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi"
import PaginationControls from "../categorise/PaginationControls"
import { ProductListSkeleton } from "./ProductListSkeleton"

interface FilterState {
  categories: string[]
  brands: string[]
  priceRanges: string[]
  sizes: string[]
  colors: string[]
}

const filterOptions = {
  categories: ["Men", "Women", "Kids"],
  brands: ["Adidas", "Tommy Hilfiger", "Nike", "Gucci", "Louis Vuitton", "Manlac"],
  priceRanges: ["Under $50", "$50 to $100", "$100 to $150", "$150 to $200", "$200 to $300"],
  sizes: ["Large", "Small", "Medium", "XL", "XXL"],
  colors: ["Black", "White", "Green", "Multi-Color", "Pink", "Yellow", "Red", "Grey"],
}

const defaultFilters: FilterState = {
  categories: [],
  brands: [],
  priceRanges: [],
  sizes: [],
  colors: [],
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value)

export default function ProductListing() {
  const { data: products, isLoading, error } = useGetAllProductsQuery({limit: 1000})
  const [filters, setFilters] = useState<FilterState>({ ...defaultFilters })
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    priceRanges: true,
    sizes: true,
    colors: true,
  })
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12 

  const isAnyFilterActive =
    filters.categories.length +
    filters.brands.length +
    filters.priceRanges.length +
    filters.sizes.length +
    filters.colors.length >
    0

  // Prevent background scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isMobileFilterOpen])

  const handleFilterChange = (filterType: keyof FilterState, value: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked ? [...prev[filterType], value] : prev[filterType].filter((item) => item !== value),
    }))
    setCurrentPage(1) // Reset page on filter change
  }

  const clearAll = () => {
    setFilters({ ...defaultFilters })
    setCurrentPage(1)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getPriceRange = (price: number): string => {
    if (price < 50) return "Under $50"
    if (price <= 100) return "$50 to $100"
    if (price <= 150) return "$100 to $150"
    if (price <= 200) return "$150 to $200"
    return "$200 to $300"
  }

  const filteredProducts = useMemo(() => {
    if (!products) return []
    return products.filter((product: any) => {
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false
      if (filters.priceRanges.length > 0 && !filters.priceRanges.includes(getPriceRange(product.price))) return false
      if (filters.sizes.length > 0 && !filters.sizes.some((s) => product.size.includes(s))) return false
      if (filters.colors.length > 0 && !filters.colors.some((c) => product.colors.includes(c))) return false
      return true
    })
  }, [filters, products])

  // Paginated products for current page
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredProducts.slice(start, end)
  }, [filteredProducts, currentPage])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const FilterSection = ({ title, items, filterKey }: { title: string; items: string[]; filterKey: keyof FilterState }) => (
    <div className="mb-6">
      <button type="button" className="flex w-full items-center justify-between mb-3" onClick={() => toggleSection(filterKey)} aria-expanded={expandedSections[filterKey]}>
        <h3 className="font-medium text-sm">{title}</h3>
        {expandedSections[filterKey] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {expandedSections[filterKey] && (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Checkbox
                id={`${filterKey}-${item}`}
                checked={filters[filterKey].includes(item)}
                onCheckedChange={(checked) => handleFilterChange(filterKey, item, checked as boolean)}
                className="h-4 w-4"
              />
              <label htmlFor={`${filterKey}-${item}`} className="text-sm text-gray-700 cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  if (isLoading) return <ProductListSkeleton />
  if (error) return <p className="text-center py-12 text-red-500">Error loading products.</p>

  return (
    <div className="min-h-screen bg-white md:rounded-lg">
      <div className="mx-auto max-w-screen-2xl w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex  flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{paginatedProducts.length}</span> of {filteredProducts.length} filtered products
          </p>

          <div className="flex gap-2">
            {isAnyFilterActive && <Button variant="ghost" size="sm" onClick={clearAll} className="text-sm">Clear all</Button>}
            <Button onClick={() => setIsMobileFilterOpen(true)} variant="outline" className="flex items-center gap-2 w-full justify-center sm:w-auto lg:hidden">
              <Filter className="h-4 w-4" />
              Filters {isAnyFilterActive ? `(${filters.categories.length + filters.brands.length + filters.priceRanges.length + filters.sizes.length + filters.colors.length})` : ""}
            </Button>
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8 -400">
          <aside className="hidden  lg:block sticky top-10 lg:w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                {isAnyFilterActive && <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">Clear all</Button>}
              </div>
              <FilterSection title="Category" items={filterOptions.categories} filterKey="categories" />
              <FilterSection title="Brands" items={filterOptions.brands} filterKey="brands" />
              <FilterSection title="Price" items={filterOptions.priceRanges} filterKey="priceRanges" />
              <FilterSection title="Size" items={filterOptions.sizes} filterKey="sizes" />
              <FilterSection title="Colors" items={filterOptions.colors} filterKey="colors" />
            </div>
          </aside>

          <main className="flex-1">
            {paginatedProducts.length === 0 ? (
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-sm text-gray-600">No products match your filters.</p>
              </div>
            ) : (
<div className="
  columns-2
  space-y-4
  md:space-y-0
  md:columns-none
  md:grid md:grid-cols-3 md:gap-6
">
                {paginatedProducts.map((product: any) => (
              <Card className="group overflow-hidden rounded-xl border bg-white transition hover:shadow-lg">
  <CardContent className="p-0">
    {/* Image */}
    <div className="relative aspect-square overflow-hidden">
      <Image
        src={product.featuredImg ?? "/placeholder.svg"}
        alt={product.description?.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Add to Cart */}
      <Button
        size="icon"
        className="absolute top-3 right-3 bg-black/80 hover:bg-black text-white opacity-0 group-hover:opacity-100 transition"
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    </div>

    {/* Content */}
    <div className="p-4 space-y-1">
      <h3 className="text-sm font-medium line-clamp-2">
        {product.description?.name}
      </h3>

      <p className="text-xs text-gray-500">{product.brand}</p>

      <div className="flex items-center gap-2 pt-1">
        <span className="font-semibold text-gray-900">
          ${product.productInfo?.price}
        </span>
        {product.originalPrice && (
          <span className="text-xs text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>
    </div>
  </CardContent>
</Card>

                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalItems={filteredProducts.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
