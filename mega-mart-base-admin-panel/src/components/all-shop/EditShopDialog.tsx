"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Upload, X } from "lucide-react"

interface EditShopDialogProps {
  open: boolean
  onClose: () => void
  shop: {
    id: string
    name: string
    tagline: string
    description: string
    location: string
    logo?: string
    coverImage?: string
    fullShop?: {
      logo?: string
      coverImage?: string
    }
  }
  onSave: (updatedShop: any) => void
}

export function EditShopDialog({
    open,
    onClose,
    shop,
    onSave,
}: EditShopDialogProps) {
    const [formData, setFormData] = useState({
        name: shop.name,
        tagline: shop.tagline,
        description: shop.description,
        location: shop.location,
        coverImage: shop.fullShop?.coverImage || shop.coverImage,
        logoImage: shop.fullShop?.logo || shop.logo,
    })

    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)

    // Initialize previews when dialog opens or shop data changes
    useEffect(() => {
        const cover = shop.fullShop?.coverImage || shop.coverImage
        const logo = shop.fullShop?.logo || shop.logo
        
        setCoverPreview(cover || null)
        setLogoPreview(logo || null)
        
        setFormData({
            name: shop.name,
            tagline: shop.tagline,
            description: shop.description,
            location: shop.location,
            coverImage: cover,
            logoImage: logo,
        })
    }, [shop, open])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target
        if (!files || !files[0]) return

        const file = files[0]
        const reader = new FileReader()

        reader.onloadend = () => {
            const result = reader.result as string
            if (name === "coverImage") {
                setCoverPreview(result)
            } else if (name === "logoImage") {
                setLogoPreview(result)
            }
        }

        reader.readAsDataURL(file)

        setFormData(prev => ({
            ...prev,
            [name]: file,
        }))
    }


    const handleSubmit = () => {
        onSave({ ...shop, ...formData })
        onClose()
    }

    const inputCSS = "space-y-2"

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Shop</DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    {/* Images Section */}
                    <div className="rounded-md ">
                        {/* Cover Image */}
                        <div className="bg-gray-100 h-32 relative rounded-md overflow-hidden group">
                            {coverPreview ? (
                                <>
                                    <Image 
                                        src={coverPreview} 
                                        alt="Cover" 
                                        fill 
                                        className="object-cover" 
                                    />
                                  
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400">
                                    <Upload className="w-8 h-8" />
                                    <span className="text-xs mt-1">Upload Cover</span>
                                </div>
                            )}
                            <Input
                                className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer z-10"
                                type="file"
                                name="coverImage"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* Logo Image */}
                        <div className="w-32 h-32 rounded-full border-4 border-white relative -mt-16 ml-6 bg-gray-100 overflow-hidden group shadow-lg">
                            {logoPreview ? (
                                <>
                                    <Image 
                                        src={logoPreview} 
                                        alt="Logo" 
                                        fill 
                                        className="object-cover" 
                                    />
                                   
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400">
                                    <Upload className="w-6 h-6" />
                                    <span className="text-xs mt-1">Logo</span>
                                </div>
                            )}
                            <Input
                                className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer z-10 rounded-full"
                                type="file"
                                name="logoImage"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="mt-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className={inputCSS}>
                            <Label htmlFor="name">Shop Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Shop name"
                            />
                        </div>
                        <div className={inputCSS}>
                            <Label htmlFor="tagline">Tagline</Label>
                            <Input
                                id="tagline"
                                name="tagline"
                                value={formData.tagline}
                                onChange={handleChange}
                                placeholder="Short tagline"
                            />
                        </div>

                        </div>

                        <div className={inputCSS}>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Shop description"
                                rows={4}
                            />
                        </div>

                        <div className={inputCSS}>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="City, Country"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}