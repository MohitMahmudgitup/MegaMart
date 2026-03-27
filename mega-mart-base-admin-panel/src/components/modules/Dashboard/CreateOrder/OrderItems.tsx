/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IProduct } from "@/types/Product";
import toast from "react-hot-toast";


interface OrderItemsProps {
  products: any;
  setSelectedProducts: any;
  selectedProducts: any;
}


const OrderItems = ({
  products,
  selectedProducts,
  setSelectedProducts,
}: OrderItemsProps) => {
  const handleRemoveAll = (id: string) => {
    setSelectedProducts((prev: any) =>
      prev.filter((p: any) => p.productId !== id)
    );
  };

  const handleAddProduct = (product: IProduct) => {
      setSelectedProducts((prev: any) => {
        const exists = prev.find((p:any) => p.productId === product._id);
        if (exists) {
          return prev.map((p:any) =>
            p.productId === product._id ? { ...p, quantity: p.quantity + 1 } : p
          );
        } else {
          toast.success(`${product.description.name} added`);
          return [...prev, { productId: product._id, quantity: 1 }];
        }
      });
  
    };


  const handleRemoveProduct = (product: IProduct) => {
     setSelectedProducts((prev:any) => {
       const existing = prev.find((p:any) => p.productId === product._id);
  
       if (existing) {
         if (existing.quantity > 1) {
           return prev.map((p:any) =>
             p.productId === product._id ? { ...p, quantity: p.quantity - 1 } : p
           );
         } else {
           toast.dismiss(); 
           toast.success(`${product.description.name} removed completely`);
           return prev.filter((p:any) => p.productId !== product._id);
         }
       }
  
       return prev;
     });
   };
  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-semibold mb-8">Order Items</h2>
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">
                Product
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">SKU</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Total</th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                Quantity
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products?.map((product: any) => (
                <tr key={product.id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{product.description.name}</td>
                  <td className="px-4 py-2">{product.productInfo.sku}</td>
                  <td className="px-4 py-2">
                    $
                    {product.productInfo.salePrice || product.productInfo.price}
                  </td>
                  <td className="px-4 py-2">
                    $
                    {product.productInfo.salePrice * product.quantity ||
                      product.productInfo.price * product.quantity}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleRemoveProduct(product)}
                        variant="outline"
                        size="sm"
                        className="bg-rose-600 text-white hover:bg-rose-500"
                      >
                        -
                      </Button>
                      <span>
                        {
                          selectedProducts?.find(
                            (p: any) => p.productId === product._id
                          )?.quantity
                        }
                      </span>
                      <Button
                        onClick={() => handleAddProduct(product)}
                        variant="outline"
                        size="sm"
                        className="bg-green-600 text-white hover:bg-green-500"
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRemoveAll(product._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No Order Items added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default OrderItems;
