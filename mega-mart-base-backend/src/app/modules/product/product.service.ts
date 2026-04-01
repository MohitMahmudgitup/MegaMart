import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { OrderModel } from "../order/order.model";
import { TagModel } from "../tags/tags.model";
import { ProductSearchableFields } from "./product.const";
import { TProduct } from "./product.interface";
import { ProductModel } from "./product.model";

const createProductOnDB = async (payload: TProduct) => {
  const result = await ProductModel.create(payload);
  return result;
};

const getAllProductFromDB = async (query: Record<string, string>) => {


  const productQuery = new QueryBuilder(ProductModel.find()
    .populate("brandAndCategories.brand")
    .populate("brandAndCategories.categories")
    .populate("brandAndCategories.tags"), query)

  const allProducts = productQuery.search(ProductSearchableFields).filter().sort().paginate();

  const [data, meta] = await Promise.all([
    allProducts.build().exec(),
    productQuery.getMeta()
  ])
  return {
    data, meta
  }

};

const getProductsByCategoryandTag = async (category: string, tag: string, slug: string) => {
  const categories = category ? (category as string).split(",") : [];

  const tags = tag ? (tag as string).split(",") : [];

  const products = await ProductModel.aggregate([
  {
    $lookup: {
      from: 'categories',
      localField: 'brandAndCategories.categories',
      foreignField: '_id',
      as: 'categoryDetails',
    },
  },
  {
    $lookup: {
      from: 'tags',
      localField: 'brandAndCategories.tags',
      foreignField: '_id',
      as: 'tagDetails',
    },
  },
  {
    $lookup: {
      from: 'brands',
      localField: 'brandAndCategories.brand',
      foreignField: '_id',
      as: 'brandDetails',
    },
  },

  // ✅ Subcategory lookup
  {
    $lookup: {
      from: 'subcategories',
      localField: 'categoryDetails.subCategories',
      foreignField: '_id',
      as: 'subCategoryDetails',
    },
  },

  {
    $addFields: {
      brandAndCategories: {
        brand: { $arrayElemAt: ['$brandDetails', 0] },
        categories: {
          $map: {
            input: '$categoryDetails',
            as: 'cat',
            in: {
              $mergeObjects: [
                '$$cat',
                {
                  subCategories: {
                    $filter: {
                      input: '$subCategoryDetails',
                      as: 'sub',
                      cond: {
                        $in: ['$$sub._id', '$$cat.subCategories'],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        tags: '$tagDetails',
      },
    },
  },

  {
    $match: {
      'description.status': 'publish',
      ...(categories.length
        ? { 'brandAndCategories.categories.name': { $in: categories } }
        : {}),
      ...(slug
        ? { 'brandAndCategories.categories.slug': slug }
        : {}),
      ...(tags.length
        ? { 'brandAndCategories.tags.name': { $in: tags } }
        : {}),
    },
  },

  {
    $project: {
      categoryDetails: 0,
      tagDetails: 0,
      brandDetails: 0,
      subCategoryDetails: 0,
    },
  },
]);

  return products;
};

const getSingleProductFromDB = async (id: string) => {
  const result = await ProductModel.findById(id)
    .select("-vendorId -shopId") // ❌ remove vendorId, shopId
    .populate({
      path: "brandAndCategories.brand",
      select: "name -_id", // ✅ only name
    })
    .populate({
      path: "brandAndCategories.categories",
      select: "name _id", // ✅ only name
    })
    .populate({
      path: "brandAndCategories.tags",
      select: "name -_id", // ✅ only name
    });

  if (!result) return null;

  // 🔥 Manual cleanup
  const obj = result.toObject();

  return {
    ...obj,

    // description clean
    description: {
      name: obj.description?.name,
      unit: obj.description?.unit,
      description: obj.description?.description,
      shortdescription: obj.description?.shortdescription,
    },

    // productInfo clean
    productInfo: {
      price: obj.productInfo?.price,
      salePrice: obj.productInfo?.salePrice,
      quantity: obj.productInfo?.quantity,
      sku: obj.productInfo?.sku,
      width: obj.productInfo?.width,
      height: obj.productInfo?.height,
      length: obj.productInfo?.length,
      isExternal: obj.productInfo?.isExternal,
      external: obj.productInfo?.external,
    },

    // specifications clean
    specifications: obj.specifications?.map((spec: any) => ({
      key: spec.key,
      value: spec.value,
    })),
  };
};

const updateProductOnDB = async (
  id: string,
  updatedData: Partial<TProduct>
) => {
  const isProductExist = await ProductModel.findById(id);
  if (!isProductExist) {
    throw new AppError(404, "Product not found!");
  }

  if (
    updatedData.deletedImages &&
    updatedData.deletedImages.length > 0 &&
    isProductExist.gallery &&
    isProductExist.gallery.length > 0
  ) {
    const restDBImages = isProductExist.gallery.filter(
      (imageurl) => !updatedData.deletedImages?.includes(imageurl)
    );

    const updatedGalleryImages = (updatedData.gallery || [])
      .filter((imageurl) => !updatedData.deletedImages?.includes(imageurl))
      .filter((imageurl) => !restDBImages.includes(imageurl));

    updatedData.gallery = [...restDBImages, ...updatedGalleryImages];
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  // delete images from cloudinary if they are deleted
  if (updatedData.deletedImages && updatedData.deletedImages.length > 0) {
    await Promise.all(
      updatedData.deletedImages.map((imageurl) =>
        deleteImageFromCLoudinary(imageurl)
      )
    );
  }

  if (updatedData.featuredImg && isProductExist.featuredImg) {
    await deleteImageFromCLoudinary(isProductExist.featuredImg);
  }

  return updatedProduct;
};


const deleteProduct = async (id: string) => {
  try {

    const product = await ProductModel.findById(id);
    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    if (product.featuredImg) {
      await deleteImageFromCLoudinary(product.featuredImg);
    }

    if (product.gallery && product.gallery.length > 0) {
      await Promise.all(
        product.gallery.map(imageurl => deleteImageFromCLoudinary(imageurl))
      );
    }

    await product.deleteOne()

  } catch (error) {
    console.error(error);

  }
}


const inventoryStats = async (id: string) => {
  const totalProducts = await ProductModel.countDocuments();

  const totalStock = await ProductModel.aggregate([
    { $group: { _id: null, total: { $sum: '$productInfo.quantity' } } },
  ]);

  const lowStockItems = await ProductModel.countDocuments({
    'productInfo.quantity': { $gt: 0, $lt: 10 },
  });

  const outOfStock = await ProductModel.countDocuments({
    'productInfo.quantity': 0,
  });

  const totalValueAgg = await ProductModel.aggregate([
    {
      $group: {
        _id: null,
        totalValue: {
          $sum: {
            $multiply: ['$productInfo.salePrice', '$productInfo.quantity'],
          },
        },
      },
    },
  ]);

  return {
    totalProducts,
    totalStock: totalStock[0]?.total || 0,
    lowStockItems,
    outOfStock,
    totalValue: totalValueAgg[0]?.totalValue || 0,
  };


};


export const bestSellingProducts = async (
  categorySlug?: string,
) => {
  let limit = 10;

  const pipeline: any[] = [
    { $unwind: "$orderInfo" },

    // total sold count
    {
      $group: {
        _id: "$orderInfo.productInfo",
        totalSold: { $sum: "$orderInfo.quantity" },
      },
    },

    { $sort: { totalSold: -1 } },

    // product lookup
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    // optional category filter
    ...(categorySlug
      ? [
          {
            $match: {
              "product.brandAndCategories.categories.slug": categorySlug,
            },
          },
        ]
      : []),

    // root replace
    { $replaceRoot: { newRoot: "$product" } },

    // 🔥 only প্রয়োজনীয় data return
    {
      $project: {
        _id: 1,
        featuredImg: 1,
        "description.name": 1,
      },
    },

    { $limit: limit },
  ];

  const result = await OrderModel.aggregate(pipeline);
  return result;
};

// -------------------------------------------------------------data Manager ------------------------------------------------
const NewArrivalsListData = async () => {
  const tag = await TagModel.findOne({ slug: "New-Arrivals" }).lean();
  if (!tag) return [];
  const products = await ProductModel.find({
    "brandAndCategories.tags": tag._id
  })
  .populate("brandAndCategories.categories", "name")
    .select(
      "featuredImg description.name description.description productInfo.price productInfo.salePrice"
    )
    .lean();

  return products;
};


const productcollection = async () => {
  const products = await ProductModel.find()
    .populate("brandAndCategories.categories", "name")
    .populate("brandAndCategories.tags", "name")
    .populate("brandAndCategories.brand", "name")
    .select(
      "featuredImg description.name  productInfo.price productInfo.salePrice"
    )
    .lean();

  return products;
};


const getSingleEditProductFromDB = async (id: string) => {
  const result = await ProductModel.findById(id)
    .populate("brandAndCategories.brand")
    .populate("brandAndCategories.categories")
    .populate("brandAndCategories.tags");
  return result;
};


export const productServices = {
  createProductOnDB,
  getSingleProductFromDB,
  getAllProductFromDB,
  updateProductOnDB,
  getProductsByCategoryandTag,
  deleteProduct,
  inventoryStats,
  bestSellingProducts,
  NewArrivalsListData,
  productcollection,
  getSingleEditProductFromDB
};
