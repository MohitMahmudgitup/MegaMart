'use client';

import { useState, useCallback } from "react";
import AddProductForm from "@/components/forms/AddProductForm";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import AliExpressImportModal from "@/components/modules/AliExpress/AliExpressImportModal";

const AddNewProductPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const [formKey, setFormKey] = useState(0);

  const handleImport = useCallback((productData: any) => {
    console.log('Product data received in AddNewProductPage:', productData);
    setImportedData(productData);
    // Force form to re-render with new data
    setFormKey(prev => prev + 1);
  }, []);

  const handleModalClose = useCallback((open: boolean) => {
    setIsImportModalOpen(open);
  }, []);

  return (
    <div className="py-6 p-2 sm:p-4">
      {/* Top Bar */}
      <div
        className="flex flex-col xl:flex-row items-center justify-between 
      mb-6 gap-4"
      >
        <div className="text-2xl font-semibold">Add New Product</div>

        <div className="flex gap-2">
          <Button onClick={() => setIsImportModalOpen(true)}>
            <Package className="mr-2 h-4 w-4" />
            Product Import from AliExpress
          </Button>
        </div>
      </div>
      
      <AddProductForm key={formKey} importedData={importedData} />

      <AliExpressImportModal
        open={isImportModalOpen}
        onOpenChange={handleModalClose}
        onImport={handleImport}
      />
    </div>
  );
};

export default AddNewProductPage;
