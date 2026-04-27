import { gql } from "graphql-tag";

export const productTypeDefs = gql`
  type Brand {
    _id: ID
    name: String
  }

  type Category {
    _id: ID
    name: String
    slug: String
  }

  type Tag {
    _id: ID
    name: String
  }

  type SubCategory {
    _id: ID
    name: String
    slug: String
  }

  type BrandAndCategories {
    brand: Brand
    categories: [Category]
    subCategories: [SubCategory]
    tags: [Tag]
  }

  type Description {
    name: String
    slug: String
    unit: String
    description: String
    shortdescription: String
    status: String
  }

  type Dimensions {
    length: String
    width: String
    height: String
  }

  type External {
    productUrl: String
    buttonLabel: String
  }

  type ProductInfo {
    price: Float
    salePrice: Float
    quantity: Int
    sku: String
    width: String
    height: String
    length: String
    isExternal: Boolean
    external: External
  }

  type Specification {
    key: String
    value: String
  }

  type Variant {
    color: String
    size: String
    price: Float
    stock: Int
  }

  type Product {
    _id: ID!
    featuredImg: String
    gallery: [String]
    video: String
    brandAndCategories: BrandAndCategories
    description: Description
    productType: String
    productInfo: ProductInfo
    specifications: [Specification]
    variants: [Variant]
    gender: String
    createdAt: String
    updatedAt: String
  }

  type ProductMeta {
    total: Int
  }

  type ProductListResult {
    data: [Product]
    meta: ProductMeta
  }

  type InventoryStats {
    totalProducts: Int
    totalStock: Int
    lowStockItems: Int
    outOfStock: Int
    totalValue: Float
  }

  type Query {
    getAllProducts: ProductListResult
    getSingleProduct(id: ID!): Product
    getProductsByCategory(id: ID!): [Product]
    getBestSellingProducts(category: String): [Product]
    getNewArrivals: [Product]
    getProductCollections: [Product]
    getInventoryStats: InventoryStats
    getSingleEditProduct(id: ID!): Product
  }
`;