import { gql } from "@apollo/client";

/* -------------------- ALL PRODUCTS -------------------- */
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      data {
        _id
        featuredImg
        gallery
        productType
        description {
          name
          shortdescription
          status
        }
        productInfo {
          price
          salePrice
          quantity
          sku
        }
        brandAndCategories {
          brand {
            name
          }
          categories {
            _id
            name
          }
          tags {
            name
          }
        }
        variants {
          color
          size
          price
          stock
        }
      }
      meta {
        total
      }
    }
  }
`;

/* -------------------- SINGLE PRODUCT -------------------- */
export const GET_SINGLE_PRODUCT = gql`
  query GetSingleProduct($id: ID!) {
    getSingleProduct(id: $id) {
      _id
     featuredImg
    gallery
    _id
    brandAndCategories {
      brand {
        name
      }
      categories {
        name
   
      }
      tags {
        name
      }
    }
    description {
      unit
      name
      description
      shortdescription
    }
    productType
    productInfo {
      external {
        buttonLabel
      }
    }
    specifications {
      value
      key
    }
    variants {
      stock
      price
      size
      color
    }
  }
}
`;

/* -------------------- BEST SELLING -------------------- */
export const GET_BEST_SELLING_PRODUCTS = gql`
  query GetBestSellingProducts($category: String) {
    getBestSellingProducts(category: $category) {
      _id
      featuredImg
      description {
        name
      }
    }
  }
`;

/* -------------------- NEW ARRIVALS -------------------- */
export const GET_NEW_ARRIVALS = gql`
  query GetNewArrivals {
    getNewArrivals {
      _id
      featuredImg
      description {
        name
        description
      }
      productInfo {
        price
        salePrice
      }
    }
  }
`;

/* -------------------- INVENTORY STATS -------------------- */
export const GET_INVENTORY_STATS = gql`
  query GetInventoryStats {
    getInventoryStats {
      totalProducts
      totalStock
      lowStockItems
      outOfStock
      totalValue
    }
  }
`;