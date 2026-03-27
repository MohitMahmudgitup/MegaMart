/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useGetAllCategoriesQuery, useEditCategoryMutation } from '@/redux/featured/categories/categoryApi'
import { selectCategories, setCategories } from '@/redux/featured/categories/categorySlice'
import ViewCategoryDetails from '@/components/category/ViewCategory'
import Category from '@/components/category/Category'
import PaginationControls from '@/components/categorise/PaginationControls'
import Swal from 'sweetalert2'
import { ICategory } from '@/types/Category'

export default function CategoryManagement() {
  const { data: allCategories, isLoading, refetch } = useGetAllCategoriesQuery()
  const [editCategory] = useEditCategoryMutation()
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // Initialize categories in redux
  useEffect(() => {
    if (allCategories) {
      dispatch(setCategories(allCategories.map(cat => ({ ...cat, isFeatured: cat.isFeatured ?? false }))))
    }
  }, [allCategories, dispatch])

  // Filter categories by search term
  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return categories.filter(
      cat => cat.name.toLowerCase().includes(term) || cat.description?.toLowerCase().includes(term)
    )
  }, [categories, searchTerm])

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)
  const paginatedCategories = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredCategories.slice(startIdx, startIdx + ITEMS_PER_PAGE)
  }, [filteredCategories, currentPage])

  // Handle toggle feature using editCategory endpoint
  const handleToggleFeature = async (category: ICategory) => {
    const currentFeaturedCount = categories.filter(cat => cat.isFeatured).length
    const willEnable = !category.isFeatured

    // Limit only applies when turning ON
    if (willEnable && currentFeaturedCount >= 4) {
      Swal.fire({
        icon: 'warning',
        title: 'Limit reached',
        text: 'Only 4 categories can be featured at a time.',
      })
      return
    }

    try {
      // Call edit-category endpoint
      await editCategory({
        id: category._id,
        updateDetails: { isFeatured: willEnable }
      }).unwrap()

      // Update local state immediately for smooth UI
      dispatch(setCategories(
        categories.map(cat =>
          cat._id === category._id ? { ...cat, isFeatured: willEnable } : cat
        )
      ))

      // Optional: refetch to sync with backend
      refetch()
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.data?.message || 'Could not update category feature status.',
      })
    }
  }

  return (
    <div className="space-y-6 py-6">
      {/* Add Category Button */}
      <div className="flex justify-end">
        <Category refetch={refetch}>+ Add Category</Category>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-3"
          />
        </div>
      </div>

      {/* Category Management Table */}
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Category Management</h2>
          <p className="text-gray-600 text-sm">Manage your product categories</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Subcategories</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Featured</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">Loading...</td>
                </tr>
              ) : paginatedCategories.length > 0 ? (
                paginatedCategories.map((category, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{category.name}</td>
                    <td className="py-4 px-4">{category.subCategories?.length || 0}</td>
                    <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{category.description}</td>
                    <td className="py-4 px-4">
                      <Switch
                        checked={category.isFeatured ?? false}
                        onCheckedChange={() => handleToggleFeature(category)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Category type="edit" editCategory={category} refetch={refetch}>
                          Edit
                        </Category>
                        <ViewCategoryDetails category={category} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PaginationControls */}
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalItems={filteredCategories.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  )
}
