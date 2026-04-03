import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { ProductModel } from "../product/product.model";
import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";
import httpStatus from "http-status";




const getAllCategoryFromDB = async () => {
  const result = await CategoryModel.find();
  return result;
}
const getSingleCategoryFromDB = async (id: string) => {
  const result = await CategoryModel.findById(id).populate(
    'subCategories'
  );
  return result;
};

const createCategoryIntoDB = async (payload: TCategory) => {
  const isCategoryExists = await CategoryModel.findOne({ name: payload?.name });

  //creating slug
  payload.slug = payload.name.split(" ").join("-").toLowerCase();

   if (payload.isFeatured === true) {
     const featuredCount = await CategoryModel.countDocuments({
       isFeatured: true,
     });

     if (featuredCount >= 4) {
       payload.isFeatured = false;

       throw new AppError(
         400,
         'Maximum 4 featured categories allowed! This category has been set to non-featured.'
       );
     }
   }

  if (isCategoryExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Category with ${isCategoryExists?.name} is already exists!`
    );
  }
  const result = await CategoryModel.create(payload);
  return result;
};


const editCategory = async (id: string, payload: TCategory) => {
  const isCategoryExists = await CategoryModel.findById(id);

  if (!isCategoryExists) {
    throw new AppError(404, 'Category not Found!');
  }

  if (payload.isFeatured === true) {
    const featuredCount = await CategoryModel.countDocuments({
      isFeatured: true,
    });

  
    if (featuredCount >= 4) {
      payload.isFeatured = false; 

      throw new AppError(
        400,
        'Maximum 4 featured categories allowed! This category has been set to non-featured.'
      );
    }
  }

  const updatedCategory = await CategoryModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });


  if (payload.deletedImages && payload.deletedImages.length > 0) {
    await Promise.all(
      payload.deletedImages.map(imageurl => deleteImageFromCLoudinary(imageurl))
    );
  }

  return updatedCategory;
};


const deleteCategoryFromDB = async (id: string) => {
  const result = await CategoryModel.findByIdAndDelete(id);
  return result;
};



const getAllProductinCategoryFromDB = async () => {
  const products = await ProductModel.find()
    .populate("brandAndCategories.categories", "_id name  details bannerImg ")
    .populate("brandAndCategories.subCategories", "_id name   details bannerImg")
    .lean();

  const categoryMap = new Map<string, any>();

  products.forEach((product) => {
    const { categories = [], subCategories = [] } =
      product.brandAndCategories || {};

    categories.forEach((cat: any) => {
      const catId = cat._id.toString();

      // 🔥 If category not exists → create
      if (!categoryMap.has(catId)) {
        categoryMap.set(catId, {
          _id: cat._id,
          name: cat.name,
          bannerImg: cat.bannerImg,
          details: cat.details,
          subCategories: [],
        });
      }

      // 🔥 Add subcategories (no duplicate)
      const existingCategory = categoryMap.get(catId);

      subCategories.forEach((sub: any) => {
        const alreadyExists = existingCategory.subCategories.some(
          (s: any) => s._id.toString() === sub._id.toString()
        );

        if (!alreadyExists) {
          existingCategory.subCategories.push({
            _id: sub._id,
            name: sub.name,
            details: sub.details,
            bannerImg: sub.bannerImg,
          });
        }
      });
    });
  });

  return Array.from(categoryMap.values());
};

export const categoryServices = {
  getAllCategoryFromDB,
  getSingleCategoryFromDB,
  createCategoryIntoDB,
  deleteCategoryFromDB,
  editCategory,
  getAllProductinCategoryFromDB
};
