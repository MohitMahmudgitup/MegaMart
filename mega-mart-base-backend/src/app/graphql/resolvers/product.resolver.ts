import { productServices } from "../../modules/product/product.service";

export const productResolvers = {
  Query: {
    getAllProducts: async (_: any, __: any) => {
      const result = await productServices.getAllProductFromDB({});
      return result;
    },

    getSingleProduct: async (_: any, { id }: { id: string }) => {
      const result = await productServices.getSingleProductFromDB(id);
      if (!result) {  throw new Error("Product not found"); }
      return result;
    },

    getProductsByCategory: async (_: any, { id }: { id: string }) => {
      return await productServices.getProductsByCategoryandSubcategory(id);
    },

    getBestSellingProducts: async (_: any, { category }: { category?: string }) => { return await productServices.bestSellingProducts(category); },

    getNewArrivals: async () => { return await productServices.NewArrivalsListData(); },

    getProductCollections: async () => { return await productServices.productcollection(); },

    getInventoryStats: async () => { return await productServices.inventoryStats("");},

    getSingleEditProduct: async (_: any, { id }: { id: string }) => {
      const productId = id.includes("-") ? id.split("-").pop()! : id;
      return await productServices.getSingleEditProductFromDB(productId);
    },
  },                                  
};