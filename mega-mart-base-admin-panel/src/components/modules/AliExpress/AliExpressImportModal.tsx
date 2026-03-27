'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/shared/SearchInput';
import { Loader2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { ALIEXPRESS_CONFIG } from '@/config/aliexpress.config';

interface AliExpressProduct {
  itemId: string;
  title: string;
  itemMainPic: string;
  salePrice: string;
  originalPrice: string;
  discount: string;
  salePriceCurrency: string;
  images: any
}

interface AliExpressImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (productData: any) => void;
}

export default function AliExpressImportModal({
  open,
  onOpenChange,
  onImport,
}: AliExpressImportModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<AliExpressProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewingDetails, setViewingDetails] = useState(false);

  // Helper function to fix protocol-relative URLs
  const fixImageUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    return url;
  };

  const searchProducts = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setLoading(true);
    try {
      const url = `https://aliexpress-business-api.p.rapidapi.com/textsearch.php?keyWord=${encodeURIComponent(
        searchTerm
      )}&pageSize=20&pageIndex=1&country=FR&currency=USD&lang=en&filter=orders&sortBy=asc`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': ALIEXPRESS_CONFIG.RAPIDAPI_KEY,
          'x-rapidapi-host': ALIEXPRESS_CONFIG.RAPIDAPI_HOST,
        },
      });

      const result = await response.json();

      console.log(result);
      

      if (result.status?.code === 200 && result.data?.itemList) {
        setProducts(result.data.itemList);
        if (result.data.itemList.length === 0) {
          toast.error('No products found');
        }
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error searching products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId: string) => {
    setLoading(true);
    try {
      const url = `https://aliexpress-business-api.p.rapidapi.com/getproduct.php?productId=${productId}&currency=USD&country=FR&lang=en_US&welcomedeal=false`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': ALIEXPRESS_CONFIG.RAPIDAPI_KEY,
          'x-rapidapi-host': ALIEXPRESS_CONFIG.RAPIDAPI_HOST,
        },
      });

      const result = await response.json();

      if (result.status?.code === 200 && result.data) {
        setSelectedProduct(result.data);
        setViewingDetails(true);
      } else {
        toast.error('Failed to fetch product details');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching product details');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (!selectedProduct) {
      toast.error('No product selected');
      return;
    }

    try {
      const productInfo = selectedProduct.productInfoComponent;
      const skuComponent = selectedProduct.skuComponent;
      const priceComponent = selectedProduct.priceComponent;

      // Get the first SKU price or default values
      const firstSku = priceComponent?.skuPriceList?.[0];
      const price = firstSku?.skuVal?.skuAmount?.value || 0;
      const salePrice = firstSku?.skuVal?.skuActivityAmount?.value || price;

      const importedData = {
        name: productInfo?.subject || '',
        description: productInfo?.subject || '',
        price: price,
        salePrice: salePrice,
        video: productInfo?.video?.videoUrl || '',
        specifications: [],
        variants: [],
        packageInfo: productInfo?.packageInfo || {},
        images: productInfo?.imageList?.map((img: string) => fixImageUrl(img)) || [],
      };

      // Extract variants from SKU properties
      if (skuComponent?.productSKUPropertyList) {
        const colorProperty = skuComponent.productSKUPropertyList.find(
          (prop: any) => prop.skuPropertyName === 'Color'
        );
        
        if (colorProperty?.skuPropertyValues) {
          importedData.variants = colorProperty.skuPropertyValues.map((val: any) => ({
            color: val.propertyValueDisplayName,
            size: 'Default',
            price: salePrice,
            stock: 0,
          }));
        }
      }

      console.log('Importing product data:', importedData);
      
      // Call the import handler
      onImport(importedData);
      
      // Show success message
      toast.success('Product imported! Note: You need to manually upload product images.');
      
      // Close modal and reset state
      setViewingDetails(false);
      setSelectedProduct(null);
      setProducts([]);
      setSearchTerm('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error importing product:', error);
      toast.error('Failed to import product. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {viewingDetails ? 'Product Details' : 'Import from AliExpress'}
          </DialogTitle>
        </DialogHeader>

        {!viewingDetails ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <SearchInput
                  placeholder="Search products on AliExpress..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={searchProducts} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>

            {products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.itemId}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={fixImageUrl(product?.itemMainPic)}
                        alt={product?.title || 'Product'}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-[#023337]">
                          ${product.salePrice}
                        </p>
                        {product.discount !== '0%' && (
                          <p className="text-xs text-gray-500 line-through">
                            ${product.originalPrice}
                          </p>
                        )}
                      </div>
                      {product.discount !== '0%' && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                          {product.discount}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => fetchProductDetails(product.itemId)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    {selectedProduct?.productInfoComponent?.subject}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {selectedProduct?.productInfoComponent?.imageList
                      ?.slice(0, 4)
                      .map((img: string, idx: number) => (
                        <div key={idx} className="relative w-full h-32">
                          <Image
                            src={fixImageUrl(img)}
                            alt={`Product ${idx + 1}`}
                            fill
                            className="object-contain rounded border"
                          />
                        </div>
                      ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 border p-4 rounded">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-lg font-semibold">
                        $
                        {selectedProduct?.priceComponent?.skuPriceList?.[0]
                          ?.skuVal?.skuAmount?.value || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sale Price</p>
                      <p className="text-lg font-semibold text-green-600">
                        $
                        {selectedProduct?.priceComponent?.skuPriceList?.[0]
                          ?.skuVal?.skuActivityAmount?.value || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {selectedProduct?.skuComponent?.productSKUPropertyList && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Available Variants:</h4>
                      {selectedProduct.skuComponent.productSKUPropertyList.map(
                        (prop: any) => (
                          <div key={prop.skuPropertyId} className="border p-3 rounded">
                            <p className="text-sm font-medium mb-2">
                              {prop.skuPropertyName}:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {prop.skuPropertyValues?.map((val: any) => (
                                <span
                                  key={val.propertyValueId}
                                  className="px-3 py-1 bg-gray-100 rounded text-sm"
                                >
                                  {val.propertyValueDisplayName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {selectedProduct?.productInfoComponent?.packageInfo && (
                    <div className="border p-4 rounded">
                      <h4 className="font-medium mb-2">Package Info:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p>
                          Weight:{' '}
                          {selectedProduct.productInfoComponent.packageInfo
                            .weight || 'N/A'}{' '}
                          kg
                        </p>
                        <p>
                          Length:{' '}
                          {selectedProduct.productInfoComponent.packageInfo
                            .length || 'N/A'}{' '}
                          cm
                        </p>
                        <p>
                          Width:{' '}
                          {selectedProduct.productInfoComponent.packageInfo
                            .width || 'N/A'}{' '}
                          cm
                        </p>
                        <p>
                          Height:{' '}
                          {selectedProduct.productInfoComponent.packageInfo
                            .height || 'N/A'}{' '}
                          cm
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewingDetails(false);
                      setSelectedProduct(null);
                    }}
                  >
                    Back to Search
                  </Button>
                  <Button onClick={handleImport}>Import Product</Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
